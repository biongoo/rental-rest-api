import { Card } from "../models/index.js";

export const postCards = (_req, res, _next) => {
    const card1 = new Card({
        isBlocked: false,
        errorCount: 0,
        amount: 10000,
        number: 1111111111111111,
        expiresMonth: 1,
        expiresYear: 2023,
        cvc: 121,
    });

    card1.save();

    const card2 = new Card({
        isBlocked: false,
        errorCount: 0,
        amount: 5000,
        number: 1234123412341234,
        expiresMonth: 2,
        expiresYear: 2022,
        cvc: 321,
    });

    card2.save();

    const card3 = new Card({
        isBlocked: false,
        errorCount: 0,
        amount: 7000,
        number: 1234512345123456,
        expiresMonth: 8,
        expiresYear: 2022,
        cvc: 123,
    });

    card3.save().then(() => {
        res.status(201).json({
            data: 'Added cards',
        });
    });
};