import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {
    carsRoutes,
    cardsRoutes,
    orderRoutes,
    paymentRoutes,
} from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE',
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
    );
    next();
});

app.use('/cars', carsRoutes);
app.use('/cards', cardsRoutes);
app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);

app.use((error, req, res, next) => {
    console.log(error);

    const status = error.statusCode ?? 500;
    const message = error.message ?? 'Unknown error';
    const inputName = error.inputName;

    res.status(status).json({ error: { message, inputName } });
});

mongoose
    .connect(
        'mongodb+srv://biongoo:VNSgZpPq4JVhm1Qe@cluster0.epcnv.mongodb.net/rental-app?retryWrites=true&w=majority',
    )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
