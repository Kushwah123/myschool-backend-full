import mongoose from 'mongoose';

const villageSchema = new mongoose.Schema({
  villageName: {
    type: String,
    required: true,
    unique: true,
  },
  villageCode: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model('Village', villageSchema);
