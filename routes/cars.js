import express from 'express';
import { getCars } from '../controllers/index.js';

export const carsRoutes = express.Router();

carsRoutes.get('', getCars);
