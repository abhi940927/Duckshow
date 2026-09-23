const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// PRE-SAVE HOOK: Handle sparse unique fields and bcrypt password hashing
userSchema.pre('save', async function() {
    if (!this.email) {
        this.email = undefined;
    }
    if (!this.phone) {
        this.phone = undefined;
    }

    if (this.isModified('password')) {
        // Only hash if not already hashed with bcrypt
        if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
});

// Instance method to verify password (supports legacy plaintext with auto-upgrade)
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
        // Legacy plaintext password check
        const isMatch = (this.password === candidatePassword);
        if (isMatch) {
            // Auto-upgrade to bcrypt hash
            this.password = candidatePassword;
            await this.save();
        }
        return isMatch;
    }
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

