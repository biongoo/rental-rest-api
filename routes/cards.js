import express from 'express';
import { postCards } from '../controllers/index.js';

export const cardsRoutes = express.Router();

cardsRoutes.get('/add', postCards);