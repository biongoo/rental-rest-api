import { validationResult } from 'express-validator';
import { Order } from '../models/index.js';

export const postOrder = (req, res, next) => {
    const { carId, email, name, phone, startDate, endDate } = req.body;
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

    const order = new Order({
        name,
        phone,
        email,
        startDate,
        endDate,
        car: { carId },
    });

    order
        .save()
        .then(result => {
            console.log(result);

            res.status(201).json({
                data: result,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.message = 'Error while creating order';
                err.statusCode = 500;
            }

            next(err);
        });
};
