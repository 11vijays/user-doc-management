import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException } from '@nestjs/common';
import { AUTH_MESSAGE, UserRole } from '../utils/constant';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: '1',
    userName: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashed_password',
    role: UserRole.VIEWER,
    phone: '+911234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await userController.findAll();
      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await userController.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };
      mockUserService.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const mockRequest = { user: { role: UserRole.ADMIN } } as any;

      const result = await userController.update(
        '1',
        updateUserDto,
        mockRequest,
      );
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
      expect(mockUserService.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw ForbiddenException if EDITOR tries to update role', async () => {
      const updateUserDto: UpdateUserDto = { role: UserRole.ADMIN };
      const mockRequest = { user: { role: UserRole.EDITOR } } as any;

      expect(() =>
        userController.update('1', updateUserDto, mockRequest),
      ).toThrow(new ForbiddenException(AUTH_MESSAGE.EDITOR_PERMISSION_ERROR));
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      mockUserService.remove.mockResolvedValue({ success: true });

      const result = await userController.remove('1');
      expect(result).toEqual({ success: true });
      expect(mockUserService.remove).toHaveBeenCalledWith('1');
    });
  });
});
