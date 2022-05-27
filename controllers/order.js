import { validationResult } from 'express-validator';
import { Order, Payment, Car } from '../models/index.js';
import { createClearDate, getDiffDays } from '../utils/index.js';

export const postOrder = async (req, res, next) => {
    try {
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

            throw error;
        }

        const now = createClearDate(new Date());
        const differenceNowWithStartDate = getDiffDays(now, startDate);

        if (differenceNowWithStartDate < 0) {
            const error = new Error('Start date can not be earlier than now.');
            error.inputName = 'startDate';
            error.statusCode = 422;

            throw error;
        }

        if (daysToRent < 1) {
            const error = new Error('Invalid dates');
            error.inputName = 'startDate';
            error.statusCode = 422;

            throw error;
        }

        if (typeof carId !== 'string' || carId.length !== 24) {
            const error = new Error('Invalid car id');
            error.statusCode = 400;

            throw error;
        }
    
        const car = await Car.findById(carId);

        if (!car) {
            const error = new Error('There is no such car');
            error.statusCode = 400;

            throw error;
        }

        const order = new Order({
            name,
            phone,
            email,
            startDate,
            endDate,
            car: car._id,
        });

        await order.save();

        const payment = new Payment({
            status: 'new',
            value: car.pricePerDay * daysToRent,
            days: daysToRent,
            order: order._id,
        });

        const paymentResult = await payment.save();

        res.status(201).json({
            data: { paymentId: paymentResult._id },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while creating order';
            err.statusCode = 500;
        }

        next(err);
        return err;
    }
};
