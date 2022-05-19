import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        status: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        days: {
            type: Number,
            required: true,
        },
        order: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true },
);

export const Payment =  mongoose.model('Payment', paymentSchema);
