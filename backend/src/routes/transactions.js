const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getTransactions).post(createTransaction);
router.get('/stats', getStats);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
