import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  weight: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['ladoo', 'gift', 'pack', 'assorted', 'premium', 'sugarfree'],
  },
  image: {
    type: String,
    default: '/laddoo.jpg',
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 100,
    min: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);