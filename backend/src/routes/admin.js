import express from 'express';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
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
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
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
    console.log('Category created:', category);
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
  try {
    const { name, price, image, category, featured } = req.body;
    
    console.log('Creating product with data:', { name, price, image, category, featured }); // Debug log
    
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }
    
    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      image: image ? image.trim() : '',
      category,
      featured: Boolean(featured) // Ensure it's a boolean
    };
    
    const product = await Product.create(productData);
    console.log('Product created:', product); // Debug log
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
});

// Edit product
router.put('/products/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, price, image, category, featured } = req.body;
    
    console.log('Updating product with data:', { name, price, image, category, featured }); // Debug log
    
    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      image: image ? image.trim() : '',
      category,
      featured: Boolean(featured) // Ensure it's a boolean
    };
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('Product updated:', product); // Debug log
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      message: 'Error updating product', 
      error: error.message 
    });
  }
});

// Delete product
router.delete('/products/:id', authenticate, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

// --- ORDER MANAGEMENT ---

// Get all orders
router.get('/orders', authenticate, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/orders/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    
    if (!deliveryStatus) {
      return res.status(400).json({ message: 'Delivery status is required' });
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({ 
        message: `Invalid delivery status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true }
    ).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
