import { validationResult } from 'express-validator';
import { Order, Payment } from '../models/index.js';
import { createClearDate, getDiffDays } from '../utils/index.js';

export const postOrder = async (req, res, next) => {
    const { carId, email, name, phone } = req.body;
    const startDate = createClearDate(req.body.startDate);
    const endDate = createClearDate(req.body.endDate);
    const daysToRent = getDiffDays(startDate, endDate) + 1;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorFromValidator = errors.array()[0];

        const error = new Error(
            `${errorFromValidator.msg} - ${errorFromValidator.param}`,
        );
        error.inputName = errorFromValidator.param;
        error.statusCode = 422;

        next(error);
        return;
    }

    if (daysToRent < 1) {
        const error = new Error(`Invalid dates`);
        error.inputName = 'startDate';
        error.statusCode = 422;

        next(error);
        return;
    }

    try {
        const order = new Order({
            name,
            phone,
            email,
            startDate,
            endDate,
            car: { carId },
        });

        const orderResult = await order.save();

        const payment = new Payment({
            status: 'new',
            value: 100,
            days: daysToRent,
            order: { xd: 'order' },
        });

        const paymentResult = await payment.save();

        res.status(201).json({
            data: { ...orderResult, ...paymentResult },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while creating order';
            err.statusCode = 500;
        }

        next(err);
    }
};
