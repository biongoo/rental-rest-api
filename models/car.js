import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const carSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        pricePerDay: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const Car =  mongoose.model('Car', carSchema);
