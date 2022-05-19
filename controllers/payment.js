export const getPayment = (req, res, next) => {
    const paymentId = req.params.paymentId;

    res.status(201).json({
        data: { xd: paymentId },
    });
};
