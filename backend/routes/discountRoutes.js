import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Endpoint to validate discount code
router.post('/validate', async (req, res) => {
  const { discountCode } = req.body;
  try {
    const product = await Product.findOne({ discountCode });
    if (product && product.isDiscountValid()) {
      return res.json({ valid: true, discount: product });
    } else {
      return res.json({ valid: false, message: 'Invalid or expired discount code' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error validating discount code', error: error.message });
  }
});

export default router;