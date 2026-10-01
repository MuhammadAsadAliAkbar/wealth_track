const express = require('express');
const router = express.Router();
const {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getNetWorth,
} = require('../controllers/assetController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getAssets).post(createAsset);
router.get('/networth', getNetWorth);
router.route('/:id').put(updateAsset).delete(deleteAsset);

module.exports = router;
