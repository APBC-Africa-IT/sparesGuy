import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Image URL or path to the image
  price: { type: Number, required: true },
  description: { type: String, required: true },
  additionalInfo: { type: String },

  // Categories
  make: { type: String, required: true }, // e.g., Toyota, Honda
  model: { type: String, required: true }, // e.g., Corolla, Civic
  year: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Used'], required: true },
  category: {
    type: String,
    enum: ['Body Part', 'Engine Part', 'Electrical Components', 'Suspension Parts', 'Transmission Parts'],
    required: true
  },

  // Stock-related fields
  quantity: { type: Number, required: true, default: 0 }, // Quantity in stock
  inStock: { type: Boolean, default: true }, // Stock status

  // Discount-related fields
  hasDiscount: { type: Boolean, default: false },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: function (v) {
        // Ensure discountPercentage is only set if hasDiscount is true
        return this.hasDiscount ? v > 0 : v === 0;
      },
      message: "Discount percentage should be greater than 0 only if the product has a discount."
    },
    default: 0 // No discount by default
  },
  discountCode: { type: String, default: uuidv4, unique: true }, // Auto-generated discount code
  discountStartDate: { type: Date },
  discountEndDate: { type: Date }
});

// Method to check if the discount is valid
productSchema.methods.isDiscountValid = function () {
  const now = new Date();
  return (
    this.hasDiscount &&
    this.discountStartDate <= now &&
    this.discountEndDate >= now
  );
};

// Method to handle product purchase
productSchema.methods.purchase = function (quantityPurchased) {
  if (this.quantity < quantityPurchased) {
    throw new Error('Out of stock');
  }

  // Deduct the quantity
  this.quantity -= quantityPurchased;

  // Update inStock status
  if (this.quantity <= 0) {
    this.quantity = 0;
    this.inStock = false;
  }

  return this.save();
};

const Product = mongoose.model("Product", productSchema);

export default Product;