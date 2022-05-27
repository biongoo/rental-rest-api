import express from 'express';
import { postCards, getCards } from '../controllers/index.js';

export const cardsRoutes = express.Router();

cardsRoutes.get('/', getCards);
cardsRoutes.get('/add', postCards);