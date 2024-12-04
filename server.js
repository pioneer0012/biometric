import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import biometricRoutes from './routes/biometricRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5600;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/biometric', biometricRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
