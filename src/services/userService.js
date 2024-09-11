require('dotenv').config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserAdmin = async () => {
    try {
        const user = await User.findOne({ email: 'admin@gmail.com' });

        if (user) {
            return {
                EC: 1,
                EM: "Admin user already exists"
            };
        }

        const hashPassword = await bcrypt.hash("1234567", saltRounds);
        let result = await User.create({
            name: "admin",
            email: "admin@gmail.com",
            phone_number: "",
            avatar: "",
            password: hashPassword,
            role: "admin",
            is_deleted: false,
            status: "active"
        });

        return {
            EC: 0,
            result: {
                name: result.name,
                email: result.email,
                phoneNumber: result.phone_number,
                avatar: result.avatar,
                role: result.role,
                status: result.status,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "An error occurred while creating the admin user"
        };
    }
};

const createUserService = async (name, email, phone_number, avatar, password, role) => {
    try {
        const user = await User.findOne({ email });

        if (user) {
            return {
                EC: 1,
                EM: `Email ${email} already in use`
            };
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        const defaultAvatar = avatar || '';

        let result = await User.create({
            name,
            email,
            phone_number,
            avatar: defaultAvatar,
            password: hashPassword,
            role,
            is_deleted: false,
            status: "active"
        });

        return {
            EC: 0,
            result: {
                name: result.name,
                email: result.email,
                phone_number: result.phone_number,
                avatar: result.avatar,
                role: result.role,
                status: result.status,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "An error occurred while creating the user"
        };
    }
};

const loginService = async (email, password) => {
    try {
        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return {
                    EC: 2,
                    EM: "Email/Password is incorrect"
                };
            } else {
                const payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name
                };
                const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

                return {
                    EC: 0,
                    accessToken,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password is incorrect"
            };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const findById = async (userId) => {
    try {
        console.log("aa",userId);
        const user = await User.findById(userId);

        if (!user) {
            return {
                EC: 1,
                EM: "User not found"
            };
        }

        return {
            EC: 0,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone_number: user.phone_number,
                avatar: user.avatar,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "An error occurred while retrieving the user"
        };
    }
};

const getUserService = async (searchCondition, pageInfo) => {
    try {
        const searchQuery = {};

        if (searchCondition.keyword) {
            searchQuery.$or = [
                { name: { $regex: searchCondition.keyword, $options: 'i' } },
                { email: { $regex: searchCondition.keyword, $options: 'i' } }
            ];
        }

        if (searchCondition.role && searchCondition.role !== 'all') {
            searchQuery.role = searchCondition.role;
        }

        if (searchCondition.status && ['active', 'inactive'].includes(searchCondition.status)) {
            searchQuery.status = searchCondition.status;
        }

        if (typeof searchCondition.is_deleted === 'boolean') {
            searchQuery.is_deleted = searchCondition.is_deleted;
        }

        const { pageNum = 1, pageSize = 10 } = pageInfo;
        const skip = (pageNum - 1) * pageSize;
        const limit = pageSize;

        const users = await User.find(searchQuery).skip(skip).limit(limit);
        const totalItems = await User.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            users,
            pageNum,
            pageSize,
            totalItems,
            totalPages
        };
    } catch (error) {
        console.log(error);
        return {
            message: "Error retrieving users",
            error
        };
    }
};

const updateUserService = async (userId, updates) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                EC: 1,
                EM: "User not found"
            };
        }

        Object.assign(user, updates);
        await user.save();

        return {
            EC: 0,
            user
        };
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Error updating user"
        };
    }
};

module.exports = {
    createUserService,
    loginService,
    getUserService,
    updateUserService,
    createUserAdmin,
    findById
};
