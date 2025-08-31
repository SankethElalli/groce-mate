import express from 'express';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// --- USER MANAGEMENT ---

// Get all users
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add user
router.post('/users', authenticate, requireAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: role || 'user' });
  res.status(201).json(user);
});

// Edit user role
router.put('/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }
    
    // Only allow role updates
    const update = { role };
    
    // Update the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select('-password'); // Don't return password in response
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User updated successfully:', user);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      message: 'Error updating user', 
      error: error.message 
    });
  }
});

// Delete user
router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

// --- CATEGORY MANAGEMENT ---

// Get all categories
router.get('/categories', authenticate, requireAdmin, async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Add category
router.post('/categories', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      message: 'Error creating category', 
      error: error.message 
    });
  }
});

// Edit category
router.put('/categories/:id', authenticate, requireAdmin, async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

// Delete category
router.delete('/categories/:id', authenticate, requireAdmin, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
});

// --- PRODUCT MANAGEMENT ---

// Get all products
router.get('/products', authenticate, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Add product
router.post('/products', authenticate, requireAdmin, async (req, res) => {
  const { name, price, image, category } = req.body;
  const product = await Product.create({ name, price, image, category });
  res.status(201).json(product);
});

// Edit product
router.put('/products/:id', authenticate, requireAdmin, async (req, res) => {
  const { name, price, image, category } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, image, category },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Delete product
router.delete('/products/:id', authenticate, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

export default router;
