import { validationResult } from 'express-validator';
import { Payment, Card } from '../models/index.js';

export const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);

        res.status(200).json({
            data: {
                _id: payment._id,
                status: payment.status,
                value: payment.value,
                days: payment.days,
                carName: 'Ferrari',
            },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Could not find payment.';
            err.statusCode = 404;
        }

        next(err);
    }
};

export const updatePayment = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorFromValidator = errors.array()[0];

            const error = new Error(
                `${
                    errorFromValidator.msg
                } - ${errorFromValidator.param.toUpperCase()}`,
            );
            error.inputName = errorFromValidator.param;
            error.statusCode = 422;

            throw error;
        }

        const { card, cvc, mm, yy } = req.body;

        const now = new Date();

        if (
            now.getFullYear() > yy ||
            (now.getFullYear() === yy && now.getMonth() + 1 >= mm)
        ) {
            const error = new Error(`Your card is expired!`);
            error.statusCode = 422;

            throw error;
        }

        const cardRecord = await Card.findOne({ number: card });

        console.log(cardRecord);

        const payment = await Payment.findById(req.params.paymentId);

        res.status(200).json({
            data: {
                _id: payment._id,
                status: payment.status,
                value: payment.value,
                days: payment.days,
                carName: 'Ferrari',
            },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Could not find payment.';
            err.statusCode = 404;
        }

        next(err);
    }
};
