const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const carsRoutes = require('./routes/cars');
const orderRoutes = require('./routes/order');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/cars', carsRoutes);
app.use('/order', orderRoutes);

app.listen(8080);
