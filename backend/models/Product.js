const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description_images: {
    type: [String],
    default: []
  },
  attributes: {
    type: [{
      name: String,
      values: [String]
    }],
    default: []
  },
  inventory: {
    type: [{
      attributes: [String],
      stock: Number,
      sku: String
    }],
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 