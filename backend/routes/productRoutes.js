import express from 'express';
import {createProduct,getAllProducts,getProductById,getRelatedProducts,updateProduct,deleteProduct,upload, uploadImage, purchaseProduct,} from '../Controllers/productController.js';
  
// Ensure this is imported correctly
 // Import all functions individually
import authMiddleware from '../Middleware/AuthMiddleware.js';
import requireAdmin from '../Middleware/roleMiddleware.js';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

const router = express.Router();

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  next();
};

// Create a new product
router.post('/', authMiddleware, createProduct);

// Get all products
router.get('/', getAllProducts);

// Get a single product by ID with ObjectId validation
router.get('/:id', validateObjectId, getProductById);

// Get related products by category
router.get('/relatedproducts', getRelatedProducts);

// Add the new route for purchasing a product
router.post('/:id/purchase', purchaseProduct); // Ensure this is a valid callback function

// Update a product by ID with ObjectId validation
router.put('/:id', authMiddleware, requireAdmin, validateObjectId, updateProduct);

// Delete a product by ID with ObjectId validation
router.delete('/:id', authMiddleware, requireAdmin, validateObjectId, deleteProduct);

// Route to upload image
router.post('/upload', upload, uploadImage);

export default router;