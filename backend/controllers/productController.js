const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    console.log('Creating new product');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { name, price, description } = req.body;
    
    // Handle attributes and inventory
    let attributes = [];
    let inventory = [];
    
    if (req.body.attributes) {
      try {
        attributes = JSON.parse(req.body.attributes);
        console.log('Parsed attributes:', JSON.stringify(attributes));
      } catch (err) {
        console.error('Error parsing attributes:', err);
      }
    }
    
    if (req.body.inventory) {
      try {
        inventory = JSON.parse(req.body.inventory);
        console.log('Parsed inventory:', JSON.stringify(inventory));
      } catch (err) {
        console.error('Error parsing inventory:', err);
      }
    }
    
    // Handle image uploads
    let mainImagePath = '';
    let descriptionImagePaths = [];
    
    // Process main image
    if (req.files && req.files.image && req.files.image.length > 0) {
      const mainImage = req.files.image[0];
      mainImagePath = `/uploads/${mainImage.filename}`;
      console.log('Main image path:', mainImagePath);
    }
    
    // Process description images
    if (req.files && req.files.description_images && req.files.description_images.length > 0) {
      descriptionImagePaths = req.files.description_images.map(file => `/uploads/${file.filename}`);
      console.log('Description image paths:', descriptionImagePaths);
    }
    
    // Create new product
    const product = new Product({
      name,
      price,
      description,
      image: mainImagePath,
      description_images: descriptionImagePaths,
      attributes,
      inventory
    });
    
    await product.save();
    console.log('Product created successfully:', JSON.stringify(product));
    
    // 检查产品是否正确保存
    const savedProduct = await Product.findById(product._id).lean();
    console.log('Saved product data:', JSON.stringify(savedProduct));
    
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    console.log('Updating product with ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { name, price, description } = req.body;
    const productId = req.params.id;
    
    // Find the existing product
    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('Existing product:', JSON.stringify(product));
    
    // Handle attributes and inventory
    let attributes = [];
    let inventory = [];
    
    if (req.body.attributes) {
      try {
        attributes = JSON.parse(req.body.attributes);
        console.log('Parsed attributes:', JSON.stringify(attributes));
      } catch (err) {
        console.error('Error parsing attributes:', err);
      }
    }
    
    if (req.body.inventory) {
      try {
        inventory = JSON.parse(req.body.inventory);
        console.log('Parsed inventory:', JSON.stringify(inventory));
      } catch (err) {
        console.error('Error parsing inventory:', err);
      }
    }
    
    // Handle image uploads
    let mainImagePath = product.image; // Default to existing image
    let descriptionImagePaths = Array.isArray(product.description_images) ? [...product.description_images] : []; // Default to existing description images
    
    console.log('Original main image:', mainImagePath);
    console.log('Original description images:', descriptionImagePaths);
    
    // Process main image
    if (req.files && req.files.image && req.files.image.length > 0) {
      const mainImage = req.files.image[0];
      mainImagePath = `/uploads/${mainImage.filename}`;
      console.log('New main image:', mainImagePath);
    } else if (req.body.original_image) {
      mainImagePath = req.body.original_image;
      console.log('Keeping original main image:', mainImagePath);
    }
    
    // Process description images
    let newDescriptionImages = [];
    if (req.files && req.files.description_images && req.files.description_images.length > 0) {
      newDescriptionImages = req.files.description_images.map(file => `/uploads/${file.filename}`);
      console.log('New description images:', newDescriptionImages);
    }
    
    // Handle original description images
    let originalDescriptionImages = [];
    if (req.body.original_description_images) {
      try {
        originalDescriptionImages = JSON.parse(req.body.original_description_images);
        console.log('Original description images from request:', originalDescriptionImages);
      } catch (err) {
        console.error('Error parsing original description images:', err);
      }
    }
    
    // Combine new and original description images
    descriptionImagePaths = [...newDescriptionImages, ...originalDescriptionImages];
    console.log('Final description images:', descriptionImagePaths);
    
    // Update product fields
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = mainImagePath;
    product.description_images = descriptionImagePaths;
    product.attributes = attributes;
    product.inventory = inventory;
    
    await product.save();
    console.log('Product updated successfully:', JSON.stringify(product));
    
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Get a single product by ID
exports.getProduct = async (req, res) => {
  try {
    console.log('Fetching product with ID:', req.params.id);
    
    // 直接从数据库中获取原始数据
    const rawProduct = await Product.findById(req.params.id).lean();
    console.log('Raw product data from database:', JSON.stringify(rawProduct));
    
    if (!rawProduct) {
      console.log('Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // 创建一个新的对象，确保所有字段都存在且格式正确
    const productData = {
      _id: rawProduct._id,
      name: rawProduct.name || '',
      price: rawProduct.price || 0,
      description: rawProduct.description || '',
      image: rawProduct.image || '',
      description_images: Array.isArray(rawProduct.description_images) ? [...rawProduct.description_images] : [],
      attributes: Array.isArray(rawProduct.attributes) ? 
        rawProduct.attributes.map(attr => ({
          name: attr.name || '',
          values: Array.isArray(attr.values) ? [...attr.values] : []
        })) : [],
      inventory: Array.isArray(rawProduct.inventory) ? 
        rawProduct.inventory.map(item => ({
          attributes: Array.isArray(item.attributes) ? [...item.attributes] : [],
          stock: item.stock || 0,
          sku: item.sku || ''
        })) : [],
      created_at: rawProduct.created_at
    };
    
    console.log('Processed product data:', JSON.stringify(productData));
    
    res.json(productData);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// ... other controller methods ... 