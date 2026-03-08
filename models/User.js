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

// PRE-SAVE HOOK: Ensure empty emails or phones are completely removed 
// instead of saved as `null` or empty strings, which breaks unique indexes.
userSchema.pre('save', async function() {
    if (!this.email) {
        this.email = undefined;
    }
    if (!this.phone) {
        this.phone = undefined;
    }
});

module.exports = mongoose.model('User', userSchema);
