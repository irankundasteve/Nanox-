import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
