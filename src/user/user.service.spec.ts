import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    userName: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'viewer',
    phone: '+911234567890',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UserService, useValue: mockUserRepository }],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.findAll.mockResolvedValue([mockUser]);

      const result = await userService.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findOne('999');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user details', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };
      mockUserRepository.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await userService.update('1', updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        '1',
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      mockUserRepository.remove.mockResolvedValue({ success: true });

      const result = await userService.remove('1');
      expect(result).toEqual({ success: true });
      expect(mockUserRepository.remove).toHaveBeenCalledWith('1');
    });
  });
});
