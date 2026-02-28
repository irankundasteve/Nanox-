import mongoose from 'mongoose';

const aboutPageContentSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true,
    },
    introParagraph: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    artisticVision: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    experienceCredentials: {
      type: String,
      required: true,
      maxlength: 2000,
      trim: true,
    },
    ctaText: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    ctaLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, collection: 'aboutPageContent' }
);

export default mongoose.model('AboutPageContent', aboutPageContentSchema);
