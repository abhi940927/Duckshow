require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const db = mongoose.connection.db;
        const collection = db.collection('users');
        
        // Find existing indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(i => i.name));
        
        // Try dropping any email indexes
        try {
            await collection.dropIndex('email_1');
            console.log('Dropped email_1 index');
        } catch (e) {
            console.log('No email_1 index to drop or error:', e.message);
        }
        
        // Recreate the index explicitly as sparse
        await collection.createIndex(
            { email: 1 }, 
            { unique: true, sparse: true, background: true }
        );
        console.log('Recreated sparse email index');

        const newIndexes = await collection.indexes();
        console.log('New indexes:', newIndexes.map(i => i.name));
        
    } catch (err) {
        console.log('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
fixIndices();
