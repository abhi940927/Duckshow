const mongoose = require('mongoose');

const myListSchema = new mongoose.Schema({
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    movies:  { type: [String], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MyList', myListSchema);
