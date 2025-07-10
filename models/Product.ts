// models/Product.ts
import mongoose, { Schema } from 'mongoose';
import { Product } from '@/types/product';

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
});

export default mongoose.models.Product ||
  mongoose.model<Product>('Product', productSchema);
