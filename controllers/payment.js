import { Payment } from "../models/index.js";

export const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);

        if (!payment) {
            const error = new Error('Could not find payment.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            data: payment,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while getting payment';
            err.statusCode = 500;
        }

        next(err);
    }
};
