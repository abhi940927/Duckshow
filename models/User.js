const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:      { type: String, required: true, trim: true },
    email:     { type: String, unique: true, lowercase: true, trim: true, sparse: true },
    phone:     { type: String, unique: true, trim: true, sparse: true },
    password:  { type: String, required: true },
    age:       { type: Number, min: 9, default: null },
    dob:       { type: Date, default: null },
    otp:       { type: String, default: null },
    otpExpires:{ type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
