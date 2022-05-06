export const postOrder = (req, res, next) => {
    const { name, carId, days } = req.body;

    // Create post in db

    res.status(201).json({
        message: 'ok',
        result: {
            id: new Date().toISOString(),
            name: name,
            carId: carId,
            days: days,
        },
    });
};
