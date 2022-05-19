import express from 'express';
import { body } from 'express-validator';
import { postOrder } from '../controllers/index.js';

export const orderRoutes = express.Router();

orderRoutes.post(
    '',
    [
        body('carId').isNumeric(),
        body('name').trim().isLength({ min: 1, max: 100 }),
        body('phone').trim().isNumeric().isLength({ min: 9, max: 9 }),
        body('email').trim().isEmail(),
        body('startDate').trim().isISO8601(),
        body('endDate').trim().isISO8601(),
    ],
    postOrder,
);
