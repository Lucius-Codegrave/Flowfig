"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_validator_1 = require("./auth.validator");
describe('Auth Validator', () => {
    describe('registerSchema', () => {
        describe('email validation', () => {
            it('should accept valid email addresses', () => {
                // Given
                const validEmails = [
                    'test@example.com',
                    'user.name@domain.co.uk',
                    'user+tag@example.org',
                    'firstname.lastname@company.com',
                    'test123@domain-name.com',
                ];
                validEmails.forEach(email => {
                    const userData = {
                        email,
                        password: 'ValidPass123!',
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(true);
                    if (result.success) {
                        expect(result.data.email).toBe(email);
                    }
                });
            });
            it('should reject invalid email addresses', () => {
                // Given
                const invalidEmails = [
                    'invalid-email',
                    'test@',
                    '@domain.com',
                    'test..test@domain.com',
                    'test@domain',
                    'test @domain.com',
                    '',
                    'test@domain..com',
                ];
                invalidEmails.forEach(email => {
                    const userData = {
                        email,
                        password: 'ValidPass123!',
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['email'],
                            }),
                        ]));
                    }
                });
            });
            it('should require email field', () => {
                // Given
                const userData = {
                    password: 'ValidPass123!',
                    // email is missing
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(userData);
                // Then
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            path: ['email'],
                            code: 'invalid_type',
                        }),
                    ]));
                }
            });
        });
        describe('password validation', () => {
            it('should accept valid passwords', () => {
                // Given
                const validPasswords = [
                    'Password123!',
                    'MySecure@Pass1',
                    'Complex#Password99',
                    'Strong$Pass2024',
                    'Valid&Password1',
                ];
                validPasswords.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(true);
                    if (result.success) {
                        expect(result.data.password).toBe(password);
                    }
                });
            });
            it('should reject passwords that are too short', () => {
                // Given
                const shortPasswords = ['Pass1!', 'Ab1!', '1234567', 'Short1!'];
                shortPasswords.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['password'],
                                message: 'Password must be at least 8 characters long',
                            }),
                        ]));
                    }
                });
            });
            it('should reject passwords that are too long', () => {
                // Given
                const longPassword = 'A'.repeat(65) + 'b1!'; // 68 characters
                const userData = {
                    email: 'test@example.com',
                    password: longPassword,
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(userData);
                // Then
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            path: ['password'],
                            message: 'Password must be less than 64 characters',
                        }),
                    ]));
                }
            });
            it('should reject passwords without uppercase letters', () => {
                // Given
                const passwordsWithoutUppercase = [
                    'password123!',
                    'mypassword1@',
                    'lowercase#99',
                    'simple$pass1',
                ];
                passwordsWithoutUppercase.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['password'],
                                message: 'Password must contain at least one uppercase letter',
                            }),
                        ]));
                    }
                });
            });
            it('should reject passwords without lowercase letters', () => {
                // Given
                const passwordsWithoutLowercase = [
                    'PASSWORD123!',
                    'MYPASSWORD1@',
                    'UPPERCASE#99',
                    'SIMPLE$PASS1',
                ];
                passwordsWithoutLowercase.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['password'],
                                message: 'Password must contain at least one lowercase letter',
                            }),
                        ]));
                    }
                });
            });
            it('should reject passwords without numbers', () => {
                // Given
                const passwordsWithoutNumbers = [
                    'Password!',
                    'MyPassword@',
                    'NoNumbers#',
                    'Simple$Pass',
                ];
                passwordsWithoutNumbers.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['password'],
                                message: 'Password must contain at least one number',
                            }),
                        ]));
                    }
                });
            });
            it('should reject passwords without special characters', () => {
                // Given
                const passwordsWithoutSpecialChars = [
                    'Password123',
                    'MyPassword1',
                    'NoSpecial99',
                    'SimplePass1',
                ];
                passwordsWithoutSpecialChars.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['password'],
                                message: 'Password must contain at least one special character',
                            }),
                        ]));
                    }
                });
            });
            it('should reject passwords with spaces', () => {
                // Given
                const passwordsWithSpaces = [
                    'Password 123!',
                    'My Password1@',
                    ' Password123!',
                    'Password123! ',
                    'Pass word123!',
                ];
                passwordsWithSpaces.forEach(password => {
                    const userData = {
                        email: 'test@example.com',
                        password,
                    };
                    // When
                    const result = auth_validator_1.registerSchema.safeParse(userData);
                    // Then
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.issues).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                path: ['password'],
                                message: 'Password must not contain spaces',
                            }),
                        ]));
                    }
                });
            });
            it('should require password field', () => {
                // Given
                const userData = {
                    email: 'test@example.com',
                    // password is missing
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(userData);
                // Then
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            path: ['password'],
                            code: 'invalid_type',
                        }),
                    ]));
                }
            });
            it('should handle multiple password validation errors', () => {
                // Given
                const userData = {
                    email: 'test@example.com',
                    password: 'weak', // Too short, no uppercase, no number, no special char
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(userData);
                // Then
                expect(result.success).toBe(false);
                if (!result.success) {
                    const passwordErrors = result.error.issues.filter(issue => issue.path[0] === 'password');
                    expect(passwordErrors.length).toBeGreaterThan(1);
                    const errorMessages = passwordErrors.map(error => error.message);
                    expect(errorMessages).toContain('Password must be at least 8 characters long');
                    expect(errorMessages).toContain('Password must contain at least one uppercase letter');
                    expect(errorMessages).toContain('Password must contain at least one number');
                    expect(errorMessages).toContain('Password must contain at least one special character');
                }
            });
        });
        describe('complete validation', () => {
            it('should accept valid user registration data', () => {
                // Given
                const validUserData = {
                    email: 'john.doe@example.com',
                    password: 'SecurePassword123!',
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(validUserData);
                // Then
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data).toEqual(validUserData);
                }
            });
            it('should reject when both email and password are invalid', () => {
                // Given
                const invalidUserData = {
                    email: 'invalid-email',
                    password: 'weak',
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(invalidUserData);
                // Then
                expect(result.success).toBe(false);
                if (!result.success) {
                    const emailErrors = result.error.issues.filter(issue => issue.path[0] === 'email');
                    const passwordErrors = result.error.issues.filter(issue => issue.path[0] === 'password');
                    expect(emailErrors.length).toBeGreaterThan(0);
                    expect(passwordErrors.length).toBeGreaterThan(0);
                }
            });
            it('should reject when no data is provided', () => {
                // Given
                const emptyData = {};
                // When
                const result = auth_validator_1.registerSchema.safeParse(emptyData);
                // Then
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            path: ['email'],
                            code: 'invalid_type',
                        }),
                        expect.objectContaining({
                            path: ['password'],
                            code: 'invalid_type',
                        }),
                    ]));
                }
            });
            it('should reject extra fields not in schema', () => {
                // Given
                const userDataWithExtraFields = {
                    email: 'test@example.com',
                    password: 'ValidPassword123!',
                    extraField: 'should be ignored',
                    anotherField: 'also ignored',
                };
                // When
                const result = auth_validator_1.registerSchema.safeParse(userDataWithExtraFields);
                // Then
                expect(result.success).toBe(true);
                if (result.success) {
                    // Zod strips extra fields by default
                    expect(result.data).toEqual({
                        email: 'test@example.com',
                        password: 'ValidPassword123!',
                    });
                    expect(result.data).not.toHaveProperty('extraField');
                    expect(result.data).not.toHaveProperty('anotherField');
                }
            });
        });
    });
});
