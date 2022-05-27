import { Car } from '../models/index.js';

export const getCars = async (_req, res, next) => {
    try {
        const cars = await Car.find({});

        res.status(201).json({
            data: cars,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while getting cars';
            err.statusCode = 500;
        }

        next(err);
        return err;
    }
};

export const postCars = async (_req, res, next) => {
    try {
        const car1 = new Car({
            name: 'BMW M5 GTS',
            pricePerDay: 2500,
            url: 'http://localhost:8080/images/BMW.webp',
        });

        const car2 = new Car({
            name: 'Ferrari 488 Pista',
            pricePerDay: 1200,
            url: 'http://localhost:8080/images/FERRARI.jpg',
        });

        const car3 = new Car({
            name: 'VW Golf 8 R',
            pricePerDay: 800,
            url: 'http://localhost:8080/images/GOLF.webp',
        });

        await Car.insertMany([car1, car2, car3]);

        res.status(201).json({
            data: 'Added cars',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.message = 'Error while creating cars';
            err.statusCode = 500;
        }

        next(err);
        return err;
    }
};
