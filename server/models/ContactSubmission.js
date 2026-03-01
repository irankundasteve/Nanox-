import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, maxlength: 20, default: '', trim: true },
    message: { type: String, required: true, maxlength: 2000, trim: true },
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
    },
  },
  { timestamps: true, collection: 'contactSubmissions' }
);

export default mongoose.model('ContactSubmission', contactSubmissionSchema);
