import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Create default admin user if not exists
async function createDefaultAdmin() {
  const adminEmail = 'admin@grocemate.com';
  const adminPassword = 'admin123'; // Change this in production!
  const exists = await User.findOne({ email: adminEmail, role: 'admin' });
  if (!exists) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hash,
      role: 'admin'
    });
    console.log('Default admin created:', adminEmail, '/', adminPassword);
  }
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    await createDefaultAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
