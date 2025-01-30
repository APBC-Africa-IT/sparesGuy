import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const discountSchema = new mongoose.Schema({
  code: { type: String, default: uuidv4, unique: true },
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isValid: { type: Boolean, default: true }
});

discountSchema.methods.isValid = function() {
  const now = new Date();
  return this.isValid && this.startDate <= now && this.endDate >= now;
};

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;