const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'duckshow_super_secret_jwt_key_2026';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, name, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
}

function generateToken(user) {
    const payload = {
        id: user._id || user.id,
        email: user.email,
        name: user.name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = {
    verifyToken,
    generateToken,
    JWT_SECRET
};
