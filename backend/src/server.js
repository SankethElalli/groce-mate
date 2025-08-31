import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

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
    console.log('MongoDB connected successfully');
    await createDefaultAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
