import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cardSchema = new Schema(
    {
        isBlocked: {
            type: Boolean,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        number: {
            type: Number,
            required: true,
        },
        expiresMonth: {
            type: Number,
            required: true,
        },
        expiresYear: {
            type: Number,
            required: true,
        },
        cvc: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

export const Card =  mongoose.model('Card', cardSchema);