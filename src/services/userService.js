require('dotenv').config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        // check if user already exists
        const user = await User.findOne({ email});
        if (user) {
          console.log(`User already exists: ${email}`);
          return null;
        }
        // hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds);
        // save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "admin"
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const LoginService = async (email, password) => {
    try {
        // fetch user by email
        const user = await User.findOne({ email: email });
        if (user) {
            // compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password is incorrect"
                }
            } else {
                // create an access token
                const payload = { email: user.email, name: user.name };
                const access_Token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                )
                return {
                    EC: 0,
                    access_Token,
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password is incorrect"
            }
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getUserService = async () => {
    try {
        let result = await User.find({});
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = {
    createUserService,
    LoginService,
    getUserService
}