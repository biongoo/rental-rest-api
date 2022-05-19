import { Car } from '../models/index.js';

export const getCars = (req, res, next) => {
    Car.find({})
        .then(cars => {
            res.status(201).json({
                data: cars,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.message = 'Error while getting cars';
                err.statusCode = 500;
            }

            next(err);
        });
};

export const postCars = (req, res, next) => {
    const car1 = new Car({
        name: 'BMW M5 GTS',
        pricePerDay: 2500,
        url: 'http://localhost:8080/images/BMW.webp',
    });

    car1.save();

    const car2 = new Car({
        name: 'Ferrari 488 Pista',
        pricePerDay: 1200,
        url: 'http://localhost:8080/images/FERRARI.jpg',
    });

    car2.save();

    const car3 = new Car({
        name: 'VW Golf 8 R',
        pricePerDay: 800,
        url: 'http://localhost:8080/images/GOLF.webp',
    });

    car3.save().then(() => {
        res.status(201).json({
            data: 'Added',
        });
    });
};
