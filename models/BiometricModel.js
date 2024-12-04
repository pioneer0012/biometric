import mongoose from 'mongoose';

const BiometricSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // When data is recorded
  userId: { type: String, required: true },     // User ID
  deviceId: { type: String, required: true },   // Device IP or unique ID
  data: { type: Object, required: true },       // Full transaction data payload
});

const Biometric = mongoose.model('Biometric', BiometricSchema);

export default Biometric;
