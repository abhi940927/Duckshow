require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function findUser() {
    const queryStr = process.argv[2];

    if (!queryStr) {
        console.log('\n❓ Usage: node find-user.js <email_or_phone>');
        console.log('Example: node find-user.js tester@test.com\n');
        process.exit(0);
    }

    console.log(`🔍 Searching for: "${queryStr}"...`);

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI missing in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Search by email or phone (case-insensitive for email)
        const user = await User.findOne({
            $or: [
                { email: queryStr.toLowerCase().trim() },
                { phone: queryStr.trim() }
            ]
        });

        if (!user) {
            console.log(`\n❌ No account found for: "${queryStr}"`);
        } else {
            console.log('\n✅ User Found!');
            console.log('-------------------------------------------');
            console.log(`NAME:        ${user.name}`);
            console.log(`EMAIL:       ${user.email || 'N/A'}`);
            console.log(`PHONE:       ${user.phone || 'N/A'}`);
            console.log(`AGE:         ${user.age || 'N/A'}`);
            console.log(`DOB:         ${user.dob ? user.dob.toISOString().split('T')[0] : 'N/A'}`);
            console.log(`CREATED AT:  ${new Date(user.createdAt).toLocaleString()}`);
            console.log(`DATABASE ID: ${user._id}`);
            console.log('-------------------------------------------\n');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

findUser();
