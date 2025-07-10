const db = require ('../models/index.js');
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/userService.js');

const login =async (req, res) => {
    try {
        const { name, password, role } = req.body;
        const user = await User.findOne({ where: { name } });
        
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        const roles = ['admin', 'user', 'vendor'];
        if (!roles.includes(role)) {
            return res.status(403).json({ status: 'error', message: 'invalid role' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 'error', message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ status: 'ok', data: { token } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getUsersById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ status: 'ok', data: user });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

const createUsers = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ status: 'ok', data: user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const updateUsers = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ status: 'ok', data: user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    getUsersById,
    createUsers,
    updateUsers,
    login
};
