import { Card } from '../models/index.js';

export const getCards = async (_req, res, next) => {
    try {
        const cards = await Card.find({});

        res.status(201).json({
            data: cards,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while getting cards';
            err.statusCode = 500;
        }

        next(err);
        return err;
    }
};

export const postCards = async (_req, res, next) => {
    try {
        const card1 = new Card({
            isBlocked: false,
            errorCount: 0,
            amount: 10000,
            number: 1111111111111111,
            expiresMonth: 1,
            expiresYear: 2023,
            cvc: 121,
        });

        const card2 = new Card({
            isBlocked: false,
            errorCount: 0,
            amount: 5000,
            number: 1234123412341234,
            expiresMonth: 2,
            expiresYear: 2022,
            cvc: 321,
        });

        const card3 = new Card({
            isBlocked: false,
            errorCount: 0,
            amount: 7000,
            number: 1234512345123456,
            expiresMonth: 8,
            expiresYear: 2022,
            cvc: 123,
        });

        await Card.insertMany([card1, card2, card3]);

        res.status(201).json({
            data: 'Added cards',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while creating cards';
            err.statusCode = 500;
        }

        next(err);
        return err;
    }
};
