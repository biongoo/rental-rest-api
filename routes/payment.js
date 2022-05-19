import express from 'express';
import { getPayment } from '../controllers/index.js';

export const paymentRoutes = express.Router();

paymentRoutes.get('/:paymentId', getPayment);