import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.mjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@techlab.com';
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      console.log('Admin user already exists');
    } else {
      const admin = new User({
        email: adminEmail,
        password: 'password123', // In a real app, this should be a secure environment variable
      });
      await admin.save();
      console.log('Admin user created successfully');
      console.log('Email: admin@techlab.com');
      console.log('Password: password123');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
