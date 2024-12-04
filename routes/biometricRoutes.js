import express from 'express';
import { fetchBiometricData, } from '../controllers/biometricController.js';

const router = express.Router();

router.get('/fetch-data', fetchBiometricData);


export default router;
