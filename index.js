const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const carsRoutes = require('./routes/cars');
const orderRoutes = require('./routes/order');

app.use(bodyParser.json());

app.use('/cars', carsRoutes);
app.use('/order', orderRoutes);

app.listen(8080);
