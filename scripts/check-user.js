require('dotenv').config();
const mongoose = require('mongoose');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const users = await db.collection('users').find({
            $or: [
                { email: /piyushsingh39540/i },
                { email: 'piyushsingh39540@gmail.com' }
            ]
        }).toArray();

        console.log('\n--- FOUND USERS ---');
        console.dir(users, { depth: null });
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

checkUser();
