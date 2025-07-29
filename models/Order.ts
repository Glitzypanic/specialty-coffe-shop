import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  date: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
