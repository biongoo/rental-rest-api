import { validationResult } from 'express-validator';
import { Payment, Card } from '../models/index.js';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key:
                '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',
        },
    }),
);

export const getPayment = async (req, res, next) => {
    try {
        const paymentId = req?.params?.paymentId;

        if (typeof paymentId !== 'string' || paymentId.length !== 24) {
            const error = new Error('Invalid payment id');
            error.statusCode = 400;

            throw error;
        }

        const payment = await Payment.findById(paymentId).populate({
            path: 'order',
            populate: [{ path: 'car' }],
        });

        if (!payment) {
            throw new Error();
        }

        res.status(200).json({
            data: {
                _id: payment._id,
                status: payment.status,
                value: payment.value,
                days: payment.days,
                carName: payment.order.car.name,
            },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Could not find payment.';
            err.statusCode = 404;
        }

        next(err);
        return err;
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

        const now = new Date();
        const { card, cvc, mm, yy } = req.body;
        const paymentId = req?.params?.paymentId;

        if (typeof paymentId !== 'string' || paymentId.length !== 24) {
            const error = new Error('Invalid payment id');
            error.statusCode = 400;

            throw error;
        }

        const payment = await Payment.findById(paymentId).populate({
            path: 'order',
        });

        if (!payment) {
            throw new Error();
        }

        if (payment.status === 'paid') {
            const error = new Error('Your payment was paid!');
            error.statusCode = 400;

            throw error;
        }

        if (
            now.getFullYear() > yy ||
            (now.getFullYear() === yy && now.getMonth() + 1 >= mm)
        ) {
            const error = new Error('Your card is expired!');
            error.statusCode = 422;

            throw error;
        }

        const cardRecord = await Card.findOne({ number: card }).exec();

        if (!cardRecord) {
            const error = new Error('There is no such card number');
            error.statusCode = 400;

            throw error;
        }

        if (cardRecord.isBlocked) {
            const error = new Error(
                'Your card is blocked! Contact your bank to unlock.',
            );
            error.statusCode = 400;

            throw error;
        }

        if (
            +cvc !== cardRecord.cvc ||
            +mm !== cardRecord.expiresMonth ||
            +yy !== cardRecord.expiresYear
        ) {
            const isBlocked = cardRecord.errorCount >= 2;

            await cardRecord.updateOne({
                errorCount: cardRecord.errorCount + 1,
                isBlocked,
            });

            const error = new Error('Your card details are invalid!');
            error.statusCode = 400;

            throw error;
        }

        if (payment.value > cardRecord.amount) {
            const error = new Error(
                'You do not have enough funds to complete the transaction.',
            );
            error.statusCode = 400;

            throw error;
        }

        await cardRecord.updateOne({
            errorCount: 0,
            amount: cardRecord.amount - payment.value,
        });

        await payment.updateOne({
            status: 'paid',
        });

        transporter.sendMail({
            to: payment.order.email,
            from: 'sheresupp@gmail.com',
            subject: 'Transaction ended - Rental App',
            html: `Visit <a href="http://localhost:3000/payment/${payment._id}">this page</a> to see payment status.`,
        });

        res.status(200).json({ data: { status: 'ok' } });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Could not find payment.';
            err.statusCode = 404;
        }

        next(err);
        return err;
    }
};
