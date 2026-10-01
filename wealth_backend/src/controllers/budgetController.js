const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Get budgets for a month
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    }).populate('category', 'name type icon color');

    // Calculate spent for each
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const result = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
              category: budget.category._id,
              type: 'expense',
              date: { $gte: start, $lte: end },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const spentAmount = spent[0]?.total || 0;
        return {
          ...budget.toObject(),
          spent: spentAmount,
          remaining: budget.amount - spentAmount,
          percentage: budget.amount > 0 ? Math.round((spentAmount / budget.amount) * 100) : 0,
        };
      })
    );

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { category, amount, month, year, notes } = req.body;

    const cat = await Category.findOne({ _id: category, user: req.user._id, type: 'expense' });
    if (!cat) {
      return res.status(400).json({ success: false, message: 'Invalid expense category' });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
        month,
        year,
      },
      { amount, notes },
      { new: true, upsert: true, runValidators: true }
    ).populate('category', 'name type icon color');

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    await budget.deleteOne();
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBudgets, setBudget, deleteBudget };
