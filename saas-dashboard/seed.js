require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({ email: 'admin@saashub.com' });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@saashub.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'active',
      phone: '+1 (555) 000-0000',
      bio: 'Platform Administrator',
      location: 'San Francisco, CA'
    });

    console.log('');
    console.log('==============================================');
    console.log('   Admin account created successfully!');
    console.log('==============================================');
    console.log('   Email    : admin@saashub.com');
    console.log('   Password : Admin@123');
    console.log('   Role     : admin');
    console.log('==============================================');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
