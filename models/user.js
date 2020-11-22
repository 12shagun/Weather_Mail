
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    fullname: { type: String, unique: true, default: '' },
    email: { type: String, unique: true },
    google: { type: String, unique: true, default: '' },
});

module.exports = mongoose.model('User', userSchema);