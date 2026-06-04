import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UrlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Please provide the original URL'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true, // Allows null/missing values to not conflict
      trim: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Password Protection
    password: {
      type: String,
      default: null,
    },
    isPasswordProtected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compare password for protected links
UrlSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return true; // No password set
  return await bcrypt.compare(enteredPassword, this.password);
};

const Url = mongoose.model('Url', UrlSchema);
export default Url;
