import express from 'express';
import { body } from 'express-validator';
import { getPayment, updatePayment } from '../controllers/index.js';

export const paymentRoutes = express.Router();

paymentRoutes.get('/:paymentId', getPayment);

paymentRoutes.patch(
    '/:paymentId',
    [
        body('card').trim().isNumeric().isLength({ min: 16, max: 16 }),
        body('cvc').trim().isNumeric({ min: 3, max: 3 }),
        body('mm').trim().isNumeric().isLength({ min: 1, max: 2 }),
        body('yy').trim().isNumeric().isLength({ min: 4, max: 4 }),
    ],
    updatePayment,
);
