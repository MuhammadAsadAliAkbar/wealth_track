const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add an asset name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['real_estate', 'vehicle', 'investment', 'cash', 'jewelry', 'electronics', 'other'],
      required: true,
    },
    currentValue: {
      type: Number,
      required: [true, 'Please add current value'],
      min: 0,
    },
    purchasePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    purchaseDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    // Optional depreciation
    depreciationRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // annual %
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

assetSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Asset', assetSchema);
