const userService = require('../../src/services/userService');
const db = require('../../src/models');
const bcrypt = require('bcrypt');

jest.mock('../../src/models', () => {
  const actual = jest.requireActual('../../src/models');
  return {
    ...actual,
    user: {
      findByPk: jest.fn(),
      create: jest.fn(),
    }
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user data if user exists', async () => {
      const mockUser = { id: 1, name: 'Fahmi', role: 'vendor' };
      db.user.findByPk.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);
      expect(db.user.findByPk).toHaveBeenCalledWith(1, {
        attributes: ['id', 'name', 'role']
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      db.user.findByPk.mockResolvedValue(null);

      await expect(userService.getUserById(999))
        .rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const input = {
        name: 'Fahmi',
        password: 'secret',
        role: 'vendor'
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      const createdUser = { id: 1, ...input, password: 'hashedPassword' };
      db.user.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(input);

      expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
      expect(db.user.create).toHaveBeenCalledWith({
        name: 'Fahmi',
        password: 'hashedPassword',
        role: 'vendor'
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw error if role is invalid', async () => {
      await expect(userService.createUser({
        name: 'Invalid',
        password: 'pass',
        role: 'manager'
      })).rejects.toThrow('Invalid role');
    });
  });

  describe('updateUser', () => {
    it('should update user name and password', async () => {
      const existingUser = {
        id: 1,
        name: 'Old Name',
        password: 'oldpass',
        role: 'vendor',
        save: jest.fn().mockResolvedValue(true)
      };

      db.user.findByPk.mockResolvedValue(existingUser);
      bcrypt.hash.mockResolvedValue('newHashedPass');

      const result = await userService.updateUser(1, {
        name: 'New Name',
        password: 'newpass',
        role: 'vendor'
      });

      expect(existingUser.name).toBe('New Name');
      expect(existingUser.password).toBe('newHashedPass');
      expect(existingUser.role).toBe('vendor');
      expect(result).toEqual(existingUser);
    });

    it('should update only name if password is empty', async () => {
      const existingUser = {
        id: 1,
        name: 'Old Name',
        password: 'oldpass',
        role: 'vendor',
        save: jest.fn().mockResolvedValue(true)
      };

      db.user.findByPk.mockResolvedValue(existingUser);

      const result = await userService.updateUser(1, {
        name: 'Only Name Update'
      });

      expect(existingUser.name).toBe('Only Name Update');
      expect(existingUser.password).toBe('oldpass'); // unchanged
      expect(result).toEqual(existingUser);
    });

    it('should throw error if user not found', async () => {
      db.user.findByPk.mockResolvedValue(null);

      await expect(userService.updateUser(999, {
        name: 'Test'
      })).rejects.toThrow('User not found');
    });

    it('should throw error if role is invalid', async () => {
      const existingUser = {
        id: 1,
        name: 'Old',
        password: '123',
        role: 'user',
        save: jest.fn()
      };

      db.user.findByPk.mockResolvedValue(existingUser);

      await expect(userService.updateUser(1, {
        role: 'alien'
      })).rejects.toThrow('Invalid role');
    });
  });
});
