"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_middleware_1 = require("./validation.middleware");
// Mock zod
jest.mock('zod', () => ({
    ...jest.requireActual('zod'),
    treeifyError: jest.fn(),
}));
// Mock auth validator
jest.mock('../validators/auth.validator', () => ({
    registerSchema: {
        safeParse: jest.fn(),
        pick: jest.fn(),
    },
}));
// Import mocked modules
const zod_1 = __importDefault(require("zod"));
const auth_validator_1 = require("../validators/auth.validator");
describe('ValidationMiddleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let mockRegisterSchema;
    let mockZod;
    beforeEach(() => {
        mockReq = {
            body: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        mockRegisterSchema = auth_validator_1.registerSchema;
        mockZod = zod_1.default;
        jest.clearAllMocks();
    });
    describe('validateRegistration', () => {
        it('should call next when validation succeeds', () => {
            // Given
            const requestBody = {
                email: 'user@example.com',
                password: 'Test123!@#',
            };
            const validatedData = {
                email: 'user@example.com',
                password: 'Test123!@#',
            };
            mockReq.body = requestBody;
            mockRegisterSchema.safeParse.mockReturnValue({
                success: true,
                data: validatedData,
            });
            // When
            (0, validation_middleware_1.validateRegistration)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRegisterSchema.safeParse).toHaveBeenCalledWith(requestBody);
            expect(mockReq.body).toEqual(validatedData);
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });
        it('should return 400 when validation fails', () => {
            // Given
            const requestBody = {
                email: 'invalid-email',
                password: '123',
            };
            const validationError = {
                issues: [{ path: ['email'], message: 'Invalid email' }],
            };
            const treeifiedError = {
                email: ['Invalid email'],
            };
            mockReq.body = requestBody;
            mockRegisterSchema.safeParse.mockReturnValue({
                success: false,
                error: validationError,
            });
            mockZod.treeifyError.mockReturnValue(treeifiedError);
            // When
            (0, validation_middleware_1.validateRegistration)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRegisterSchema.safeParse).toHaveBeenCalledWith(requestBody);
            expect(mockZod.treeifyError).toHaveBeenCalledWith(validationError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                errors: treeifiedError,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
    describe('validateLogin', () => {
        it('should call next when validation succeeds', () => {
            // Given
            const requestBody = {
                email: 'user@example.com',
                password: 'Test123!@#',
            };
            const validatedData = {
                email: 'user@example.com',
                password: 'Test123!@#',
            };
            const loginSchema = {
                safeParse: jest.fn().mockReturnValue({
                    success: true,
                    data: validatedData,
                }),
            };
            mockReq.body = requestBody;
            mockRegisterSchema.pick.mockReturnValue(loginSchema);
            // When
            (0, validation_middleware_1.validateLogin)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRegisterSchema.pick).toHaveBeenCalledWith({
                email: true,
                password: true,
            });
            expect(loginSchema.safeParse).toHaveBeenCalledWith(requestBody);
            expect(mockReq.body).toEqual(validatedData);
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });
        it('should return 400 when validation fails', () => {
            // Given
            const requestBody = {
                email: 'invalid-email',
                password: '123',
            };
            const validationError = {
                issues: [{ path: ['password'], message: 'Password too short' }],
            };
            const treeifiedError = {
                password: ['Password too short'],
            };
            const loginSchema = {
                safeParse: jest.fn().mockReturnValue({
                    success: false,
                    error: validationError,
                }),
            };
            mockReq.body = requestBody;
            mockRegisterSchema.pick.mockReturnValue(loginSchema);
            mockZod.treeifyError.mockReturnValue(treeifiedError);
            // When
            (0, validation_middleware_1.validateLogin)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRegisterSchema.pick).toHaveBeenCalledWith({
                email: true,
                password: true,
            });
            expect(loginSchema.safeParse).toHaveBeenCalledWith(requestBody);
            expect(mockZod.treeifyError).toHaveBeenCalledWith(validationError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                errors: treeifiedError,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should handle missing request body', () => {
            // Given
            const validationError = {
                issues: [{ path: ['email'], message: 'Required' }],
            };
            const treeifiedError = {
                email: ['Required'],
            };
            const loginSchema = {
                safeParse: jest.fn().mockReturnValue({
                    success: false,
                    error: validationError,
                }),
            };
            mockReq.body = undefined;
            mockRegisterSchema.pick.mockReturnValue(loginSchema);
            mockZod.treeifyError.mockReturnValue(treeifiedError);
            // When
            (0, validation_middleware_1.validateLogin)(mockReq, mockRes, mockNext);
            // Then
            expect(mockRegisterSchema.pick).toHaveBeenCalledWith({
                email: true,
                password: true,
            });
            expect(loginSchema.safeParse).toHaveBeenCalledWith(undefined);
            expect(mockZod.treeifyError).toHaveBeenCalledWith(validationError);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                errors: treeifiedError,
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
});
