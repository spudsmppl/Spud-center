import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a node name'],
    unique: true
  },
  url: {
    type: String,
    required: [true, 'Please provide a website URL'],
    match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please provide a valid URL']
  },
  status: {
    type: String,
    enum: ['live', 'stopped', 'unstable'],
    default: 'stopped'
  },
  statusCode: Number,
  lastChecked: Date,
  responseTime: Number,
  description: String,
  apiKey: {
    type: String,
    unique: true,
    sparse: true
  },
  checkInterval: {
    type: Number,
    default: 60000 // 1 minute
  },
  isMonitoring: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Node', NodeSchema);
