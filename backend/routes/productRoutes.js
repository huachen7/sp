const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Admin routes
router.post('/', 
  authenticateAdmin, 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'description_images', maxCount: 10 }
  ]), 
  productController.createProduct
);

router.put('/:id', 
  authenticateAdmin, 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'description_images', maxCount: 10 }
  ]), 
  productController.updateProduct
);

router.delete('/:id', authenticateAdmin, productController.deleteProduct);

module.exports = router; 