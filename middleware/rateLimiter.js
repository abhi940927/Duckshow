const rateLimit = require('express-rate-limit');

// General auth rate limiter (e.g. login, register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
    }
});

// Strict OTP limiter
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 6, // Limit each IP to 6 OTP verification attempts per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many OTP verification attempts. Please wait 10 minutes before trying again.'
    }
});

module.exports = {
    authLimiter,
    otpLimiter
};
