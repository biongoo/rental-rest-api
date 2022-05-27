import express from 'express';
import { getCars, postCars } from '../controllers/index.js';

export const carsRoutes = express.Router();

carsRoutes.get('', getCars);
carsRoutes.get('/add', postCars);
