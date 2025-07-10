const userController = require('../../src/controllers/userController');
const userService = require('../../src/services/userService');
const db = require('../../src/models/index.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../../src/services/userService');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

const User = db.user;

jest.mock('../../src/models/index.js', () => {
  const userMock = {
    findOne: jest.fn(),
    findByPk: jest.fn()
  };
  return { user: userMock };
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return a token', async () => {
      const req = {
        body: { name: 'fahmi', password: '123', role: 'vendor' }
      };
      const res = mockRes();

      const mockUser = {
        id: 1,
        name: 'fahmi',
        password: 'hashed_pw',
        role: 'vendor'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'ok',
        data: { token: 'mock-token' }
      });
    });

    it('should return error if user not found', async () => {
      const req = { body: { name: 'unknown' } };
      const res = mockRes();

      User.findOne.mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found'
      });
    });

    it('should return error for invalid role', async () => {
      const req = { body: { name: 'fahmi', password: '123', role: 'invalid' } };
      const res = mockRes();

      User.findOne.mockResolvedValue({});

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'invalid role'
      });
    });

    it('should return error for invalid password', async () => {
      const req = {
        body: { name: 'fahmi', password: 'wrong', role: 'vendor' }
      };
      const res = mockRes();

      User.findOne.mockResolvedValue({ password: 'hashed_pw', role: 'vendor' });
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid password'
      });
    });
  });

  describe('getUsersById', () => {
    it('should return user by id', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();

      const mockUser = { id: 1, name: 'fahmi', role: 'vendor' };

      userService.getUserById.mockResolvedValue(mockUser);

      await userController.getUsersById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'ok',
        data: mockUser
      });
    });

    it('should return error if user not found', async () => {
      const req = { params: { id: 99 } };
      const res = mockRes();

      userService.getUserById.mockRejectedValue(new Error('User not found'));

      await userController.getUsersById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User not found'
      });
    });
  });

  describe('createUsers', () => {
    it('should create user successfully', async () => {
      const req = { body: { name: 'fahmi', password: '123', role: 'vendor' } };
      const res = mockRes();

      userService.createUser.mockResolvedValue(req.body);

      await userController.createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'ok',
        data: req.body
      });
    });

    it('should handle create error', async () => {
      const req = { body: {} };
      const res = mockRes();

      userService.createUser.mockRejectedValue(new Error('Create failed'));

      await userController.createUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Create failed'
      });
    });
  });

  describe('updateUsers', () => {
    it('should update user successfully', async () => {
      const req = { params: { id: 1 }, body: { name: 'updated' } };
      const res = mockRes();

      userService.updateUser.mockResolvedValue({ id: 1, name: 'updated' });

      await userController.updateUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'ok',
        data: { id: 1, name: 'updated' }
      });
    });

    it('should handle update error', async () => {
      const req = { params: { id: 1 }, body: {} };
      const res = mockRes();

      userService.updateUser.mockRejectedValue(new Error('Update failed'));

      await userController.updateUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Update failed'
      });
    });
  });
});
