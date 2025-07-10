const db = require('../models/index.js');
const User = db.user;
const bcrypt = require('bcrypt');

const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'role']
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const createUser = async ({ name, password, role }) => {
    const roles = ['admin', 'user', 'vendor'];
    if (role && !roles.includes(role)) {
        throw new Error('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        name,
        password: hashedPassword,
        role
    });

    return newUser;
};

const updateUser = async (id, { name, password, role }) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new Error('User not found');
    }

    const roles = ['admin', 'user', 'vendor'];
    if (role && !roles.includes(role)) {
        throw new Error('Invalid role');
    }

    user.name = name || user.name;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.role = role || user.role;

    await user.save();
    return user;
};

module.exports = {
    getUserById,
    createUser,
    updateUser
};
