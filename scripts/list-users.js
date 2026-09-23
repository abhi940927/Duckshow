require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function listUsers() {
    console.log('🔍 Fetching all users from Duckshow Database...');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI missing in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}).sort({ createdAt: -1 });

        if (users.length === 0) {
            console.log('📭 No users found.');
        } else {
            console.log(`✅ Found ${users.length} users:\n`);
            
            // Define header for table-like view
            console.log(''.padEnd(120, '-'));
            console.log(
                'NAME'.padEnd(20) + 
                'EMAIL/PHONE'.padEnd(30) + 
                'AGE'.padEnd(5) + 
                'DOB'.padEnd(15) + 
                'CREATED AT'.padEnd(25)
            );
            console.log(''.padEnd(120, '-'));

            users.forEach(user => {
                const identifier = user.email || user.phone || 'N/A';
                const dob = user.dob ? user.dob.toISOString().split('T')[0] : 'N/A';
                const created = user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A';
                
                console.log(
                    (user.name || 'N/A').substring(0, 18).padEnd(20) + 
                    identifier.substring(0, 28).padEnd(30) + 
                    (user.age || '--').toString().padEnd(5) + 
                    dob.padEnd(15) + 
                    created.padEnd(25)
                );
            });
            console.log(''.padEnd(120, '-'));
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

listUsers();
