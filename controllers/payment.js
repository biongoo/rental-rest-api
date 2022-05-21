import { Payment } from '../models/index.js';

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
