import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String, required: true, maxlength: 500, trim: true },
    details: { type: String, maxlength: 2000, default: '', trim: true },
    pricing: { type: String, maxlength: 2000, default: '', trim: true },
  },
  { timestamps: true, collection: 'services' }
);

export default mongoose.model('Service', serviceSchema);
