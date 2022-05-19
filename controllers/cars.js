const cars = [
    {
        _id: 1,
        name: 'BMW M5 GTS',
        pricePerDay: 1200,
        url: 'http://localhost:8080/images/BMW.webp',
    },
    {
        _id: 2,
        name: 'Ferrari 488 Pista',
        pricePerDay: 2500,
        url: 'http://localhost:8080/images/FERRARI.jpg',
    },
    {
        _id: 3,
        name: 'VW Golf 8 R',
        pricePerDay: 800,
        url: 'http://localhost:8080/images/GOLF.webp',
    },
];

export const getCars = (req, res, next) => {
    res.status(201).json({
        data: cars,
    });
};
