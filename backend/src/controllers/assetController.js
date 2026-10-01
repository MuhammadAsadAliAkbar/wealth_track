const Asset = require('../models/Asset');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res) => {
  try {
    const { type, active } = req.query;
    const query = { user: req.user._id };
    if (type) query.type = type;
    if (active !== undefined) query.isActive = active === 'true';

    const assets = await Asset.find(query).sort({ currentValue: -1 });

    const totalValue = assets.reduce((sum, a) => sum + (a.isActive ? a.currentValue : 0), 0);

    res.json({
      success: true,
      count: assets.length,
      totalValue,
      data: assets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create asset
// @route   POST /api/assets
// @access  Private
const createAsset = async (req, res) => {
  try {
    const asset = await Asset.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = async (req, res) => {
  try {
    let asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    if (asset.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }
    if (asset.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    await asset.deleteOne();
    res.json({ success: true, message: 'Asset deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get net worth summary
// @route   GET /api/assets/networth
// @access  Private
const getNetWorth = async (req, res) => {
  try {
    const assets = await Asset.find({ user: req.user._id, isActive: true });
    const byType = {};
    let total = 0;

    assets.forEach((a) => {
      if (!byType[a.type]) byType[a.type] = 0;
      byType[a.type] += a.currentValue;
      total += a.currentValue;
    });

    res.json({
      success: true,
      data: {
        totalNetWorth: total,
        byType,
        assetCount: assets.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getNetWorth,
};
