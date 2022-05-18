export const postOrder = (req, res, next) => {
    const { carId, email, name, phone, startDate } = req.body;

    // Create order in db

    res.status(201).json({
        error: { name: 'xd', message: 'XDD', inputName: 'phone' },
        data: {
            id: new Date().toISOString(),
        },
    });
};
