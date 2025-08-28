import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
