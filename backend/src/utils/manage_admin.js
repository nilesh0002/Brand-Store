const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brand-store';

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function run() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');

    const email = 'divyansh@brandstore.com';
    const defaultPassword = 'DivyanshAdmin2026!';

    // Search for existing user with name containing "divyansh" or with this email
    let user = await User.findOne({ 
      $or: [
        { email: email },
        { name: { $regex: 'divyansh', $options: 'i' } }
      ]
    });

    if (user) {
      console.log(`Found existing user: ${user.name} (${user.email})`);
      user.role = 'admin';
      await user.save();
      console.log(`✅ Role successfully updated to: ${user.role}`);
      console.log(`\n--- ADMIN CREDENTIALS ---`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: (use the existing password for this account)`);
      console.log(`-------------------------\n`);
    } else {
      console.log(`User not found. Creating new admin user "Divyansh Singh"...`);
      user = new User({
        name: 'Divyansh Singh',
        email: email,
        password: defaultPassword,
        role: 'admin'
      });
      await user.save();
      console.log('✅ Admin user created successfully!');
      console.log(`\n--- NEW ADMIN CREDENTIALS ---`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${defaultPassword}`);
      console.log(`-----------------------------\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing database script:', error);
    process.exit(1);
  }
}

run();
