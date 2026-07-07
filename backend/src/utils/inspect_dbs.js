const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    console.log('Connecting to Atlas...');
    const client = await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    const adminDb = mongoose.connection.db.admin();
    const dbsList = await adminDb.listDatabases();
    console.log('\n--- DATABASES ON ATLAS ---');
    dbsList.databases.forEach(db => {
      console.log(`- ${db.name} (Size: ${db.sizeOnDisk} bytes)`);
    });
    console.log('--------------------------\n');

    // List collections in current connection database
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Current active database in connection string: "${dbName}"`);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Collections in "${dbName}":`);
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });

    // Check count of users in this database
    if (collections.some(c => c.name === 'users')) {
      const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const userCount = await User.countDocuments();
      const adminUsers = await User.find({ role: 'admin' });
      console.log(`Total users in "${dbName}": ${userCount}`);
      console.log('Admin users found:', adminUsers.map(u => ({ name: u.name, email: u.email })));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error inspecting databases:', error);
    process.exit(1);
  }
}

run();
