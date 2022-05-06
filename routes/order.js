import express from 'express';
import { postOrder } from '../controllers/index.js';

export const orderRoutes = express.Router();

orderRoutes.post('', postOrder);
