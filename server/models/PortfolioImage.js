import mongoose from 'mongoose';

const portfolioImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PortfolioImage', portfolioImageSchema);
