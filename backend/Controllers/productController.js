import express from 'express';
import Product from '../Models/productModel.js';
import multer from 'multer';
import path from 'path';

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Set destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set file name as current timestamp + file extension
  },
});

// Multer middleware with file validation
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, SVG ad PNG files are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('image');

// Controller function for uploading images
export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file format.' });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get related products by category
export const getRelatedProducts = async (req, res) => {
  const { category } = req.params;

  if (!category) {
    return res.status(400).json({ error: 'Category query parameter is required.' });
  }

  try {
    const relatedProducts = await Product.find({ category }).limit(8);

    if (!relatedProducts.length) {
      return res.status(200).json({ message: 'No related products found', products: [] });
    }

    res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Purchase a product
export const purchaseProduct = async (req, res) => {
  const { productId } = req.params;
  const { quantityPurchased } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock availability
    if (product.inStock < quantityPurchased) {
      return res.status(400).json({ error: 'Not enough stock available.' });
    }

    // Update stock quantity
    product.inStock -= quantityPurchased;
    await product.save();

    res.status(200).json({ message: 'Purchase successful', product });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Export all functions
export default {
  createProduct,
  getAllProducts,
  getProductById,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
  upload,
  uploadImage,
  purchaseProduct,
};
