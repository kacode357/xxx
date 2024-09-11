const { createUserService, loginService, getUserService, updateUserService, createUserAdmin, findById } = require("../services/UserService");

const createUser = async (req, res) => {
    const { name, email, phone_number, avatar, password, role } = req.body;
    const data = await createUserService(name, email, phone_number, avatar, password, role);
    
    if (data.EC === 1) {
        return res.status(400).json({
            success: false,
            message: data.EM,
            errors: []
        });
    }
    
    return res.status(200).json({
        success: true,
        data: data.result
    });
};

const generateAdmin = async (req, res) => {
    const data = await createUserAdmin();
    
    if (data.EC === 1) {
        return res.status(400).json({
            success: false,
            message: data.EM,
            errors: []
        });
    }

    return res.status(200).json({
        success: true,
        data: data.result
    });
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);

    if (data.EC === 1 || data.EC === 2) {
        return res.status(400).json({
            success: false,
            message: data.EM,
            errors: []
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            token: data.accessToken
        }
    });
};

const getUser = async (req, res) => {
    const { searchCondition, pageInfo } = req.body;
    const data = await getUserService(searchCondition, pageInfo);

    return res.status(200).json({
        success: true,
        data
    });
};

const getCurrentAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = await findById(userId);
        if (data.EC === 1) {
            return res.status(404).json({
                success: false,
                message: data.EM,
                errors: []
            });
        }

        return res.status(200).json({
            success: true,
            data: data.user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving user",
            errors: []
        });
    }
};

const updateAccount = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
    
    try {
        const updatedUser = await updateUserService(userId, updates);

        if (updatedUser.EC === 1) {
            return res.status(404).json({
                success: false,
                message: updatedUser.EM,
                errors: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account updated successfully",
            data: updatedUser.user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error updating account",
            errors: []
        });
    }
};

module.exports = {
    createUser,
    handleLogin,
    getUser,
    updateAccount,
    generateAdmin,
    getCurrentAccount
};
