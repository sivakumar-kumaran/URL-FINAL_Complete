import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    default: 'Unknown',
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  os: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    default: 'Desktop',
  },
});

const Visit = mongoose.model('Visit', VisitSchema);
export default Visit;
