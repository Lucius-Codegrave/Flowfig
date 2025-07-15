"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("./auth.middleware");
// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));
// Mock the UserService
jest.mock('../services/user.service', () => ({
    userService: {
        findUserById: jest.fn(),
    },
}));
// Import mocked modules
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user.service");
// Global mock references
const mockJwt = jsonwebtoken_1.default;
const mockUserService = user_service_1.userService;
describe('AuthMiddleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });
    describe('authenticateToken', () => {
        it('should return 401 when no authorization header is provided', async () => {
            // Given
            mockReq.headers = {};
            // When
            await (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Access token required',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 401 when no token is provided in authorization header', async () => {
            // Given
            mockReq.headers = {
                authorization: 'Bearer ',
            };
            // When
            await (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Access token required',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 403 when token is invalid', async () => {
            // Given
            mockReq.headers = {
                authorization: 'Bearer invalid-token',
            };
            mockJwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            // When
            await (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, mockNext);
            // Then
            expect(mockJwt.verify).toHaveBeenCalledWith('invalid-token', expect.any(String));
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid or expired token',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should return 401 when user is not found', async () => {
            // Given
            const token = 'valid-token';
            const decodedPayload = { userId: 1, iat: 123, exp: 456 };
            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };
            mockJwt.verify.mockReturnValue(decodedPayload);
            mockUserService.findUserById.mockResolvedValue(null);
            // When
            await (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, mockNext);
            // Then
            expect(mockJwt.verify).toHaveBeenCalledWith(token, expect.any(String));
            expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid token - user not found',
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should authenticate successfully and call next', async () => {
            // Given
            const token = 'valid-token';
            const decodedPayload = { userId: 1, iat: 123, exp: 456 };
            const user = {
                id: 1,
                email: 'user@example.com',
                password: 'hashedPassword',
                role: 'EDITOR',
            };
            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };
            mockJwt.verify.mockReturnValue(decodedPayload);
            mockUserService.findUserById.mockResolvedValue(user);
            // When
            await (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, mockNext);
            // Then
            expect(mockJwt.verify).toHaveBeenCalledWith(token, expect.any(String));
            expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
            expect(mockReq.user).toEqual({
                id: 1,
                email: 'user@example.com',
                role: 'EDITOR',
            });
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });
    });
});
