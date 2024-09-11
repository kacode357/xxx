const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id : String,
    name: String,
    email: String,
    password: String,
    role: String,
    avatar : String,
    phone_number: String,
    status: String,
    is_deleted: Boolean
}, { timestamps: true }); // Thêm timestamps vào schema

const User = mongoose.model('User', userSchema);

module.exports = User;
