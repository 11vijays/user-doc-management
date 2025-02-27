import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AUTH_MESSAGE } from '../utils/constant';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    create: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        userName: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test@1234',
        role: 'viewer',
        phone: '+911234567890',
      };

      const expectedResponse = { success: true, data: createUserDto };

      mockAuthService.create.mockResolvedValue(expectedResponse);

      expect(await authController.create(createUserDto)).toEqual(
        expectedResponse,
      );
      expect(mockAuthService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      const token = 'mocked_jwt_token';

      mockAuthService.login.mockResolvedValue(token);

      await authController.login(createAuthDto, mockResponse as Response);

      expect(mockAuthService.login).toHaveBeenCalledWith(createAuthDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({ success: true, token });
    });

    it('should throw an error if login fails', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(
        new Error(AUTH_MESSAGE.USER_NOT_EXIST),
      );

      await expect(
        authController.login(createAuthDto, {} as Response),
      ).rejects.toThrow(AUTH_MESSAGE.USER_NOT_EXIST);
    });
  });

  describe('logout', () => {
    it('should log out a user successfully', async () => {
      const req = { user: { userId: 1 } } as any;
      const expectedResponse = { success: true, message: AUTH_MESSAGE.LOGOUT };
      mockAuthService.logout.mockResolvedValue(expectedResponse);
      expect(await authController.logout(req)).toEqual(expectedResponse);
      expect(mockAuthService.logout).toHaveBeenCalledWith(1);
    });
  });
});
