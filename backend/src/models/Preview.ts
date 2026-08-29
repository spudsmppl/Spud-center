import mongoose from 'mongoose';

const PreviewSchema = new mongoose.Schema({
  nodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    required: true
  },
  screenshotPath: String,
  htmlSnapshot: {
    type: String,
    default: null
  },
  title: String,
  description: String,
  lastCaptured: {
    type: Date,
    default: Date.now
  },
  captureInterval: {
    type: Number,
    default: 300000 // 5 minutes
  }
});

export default mongoose.model('Preview', PreviewSchema);
