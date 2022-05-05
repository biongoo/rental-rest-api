const express = require('express');

const app = express();

const carsRoutes = require('./routes/cars');
const orderRoutes = require('./routes/order');

app.use('/cars', carsRoutes);
app.use('/order', orderRoutes);

app.listen(8080);