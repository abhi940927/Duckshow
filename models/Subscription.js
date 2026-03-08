const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan:           { type: String, default: 'free', enum: ['free', 'premiere'] },
    subscribedAt:   { type: Date, default: Date.now },
    nextBillingDate:{ type: String }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
