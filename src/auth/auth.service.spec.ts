import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../user/entities/user.entity';
import { AUTH_MESSAGE } from '../utils/constant';
import { CustomBadException } from '../utils/error/error-handler';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser: User = {
    id: 1,
    userName: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'viewer',
    phone: '+911234567890',
    tokenVersion: 1,
  } as User;

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    updateTokenVersion: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('create', () => {
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

      const expectedResponse = { success: true, data: mockUser };
      mockUserService.create.mockResolvedValue(expectedResponse);

      const result = await authService.create(createUserDto);
      expect(result).toEqual(expectedResponse);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  jest.mock('bcrypt', () => ({
    ...jest.requireActual('bcrypt'), // Keep real bcrypt functionality
    compare: jest.fn(), // Mock compare function
  }));

  describe('validateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks(); //  Clears previous mocks
    });

    it('should return user if credentials are valid', async () => {
      // ✅ Ensure `findByEmail` returns an object with `dataValues`
      mockUserService.findByEmail.mockResolvedValue({ dataValues: mockUser });

      // ✅ Ensure bcrypt.compare resolves to true
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser(
        mockUser.email,
        'Test@1234',
      );

      expect(result).toEqual(mockUser); // ✅ Expected user object
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Test@1234',
        mockUser.password,
      );
    });

    it('should return null if credentials are invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue({ dataValues: mockUser });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        mockUser.email,
        'wrong_password',
      );

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrong_password',
        mockUser.password,
      );
    });

    it('should return null if user does not exist', async () => {
      mockUserService.findByEmail.mockResolvedValue(null); // ✅ Simulate user not found

      const result = await authService.validateUser(
        'nonexistent@example.com',
        'password',
      );

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });
  });

  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      const loginDto: CreateAuthDto = {
        email: mockUser.email,
        password: 'Test@1234',
      };

      // ""Ensure validateUser() returns the user
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await authService.login(loginDto);

      expect(result).toBe('mocked_jwt_token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        user: mockUser.email,
        sub: mockUser.id,
        version: mockUser.tokenVersion,
      });
    });

    it('should throw an error if login fails', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const loginDto: CreateAuthDto = {
        email: 'invalid@example.com',
        password: 'password',
      };

      await expect(authService.login(loginDto)).rejects.toThrowError(
        CustomBadException,
      );
    });
  });

  describe('logout', () => {
    it('should log out a user successfully', async () => {
      mockUserService.updateTokenVersion.mockResolvedValue(null);

      const result = await authService.logout(1);
      expect(result).toEqual({ success: true, message: AUTH_MESSAGE.LOGOUT });
      expect(mockUserService.updateTokenVersion).toHaveBeenCalledWith(1);
    });
  });
});
