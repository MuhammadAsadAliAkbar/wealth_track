const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, currency } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      currency: currency || 'PKR',
    });

    // Create default categories
    const defaultCategories = [
      { name: 'Salary', type: 'income', icon: 'briefcase', color: '#10b981' },
      { name: 'Freelance', type: 'income', icon: 'laptop', color: '#059669' },
      { name: 'Investment Returns', type: 'income', icon: 'trending-up', color: '#047857' },
      { name: 'Food & Dining', type: 'expense', icon: 'utensils', color: '#ef4444' },
      { name: 'Transport', type: 'expense', icon: 'car', color: '#f97316' },
      { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#eab308' },
      { name: 'Bills & Utilities', type: 'expense', icon: 'zap', color: '#8b5cf6' },
      { name: 'Entertainment', type: 'expense', icon: 'film', color: '#ec4899' },
      { name: 'Healthcare', type: 'expense', icon: 'heart', color: '#14b8a6' },
      { name: 'Education', type: 'expense', icon: 'book', color: '#3b82f6' },
      { name: 'Rent/Mortgage', type: 'expense', icon: 'home', color: '#6366f1' },
      { name: 'Other', type: 'expense', icon: 'more-horizontal', color: '#6b7280' },
    ];

    await Category.insertMany(
      defaultCategories.map((cat) => ({ ...cat, user: user._id }))
    );

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe };
