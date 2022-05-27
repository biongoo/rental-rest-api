import { expect } from 'chai';
import mongoose from 'mongoose';

import { Order, Car, Payment } from '../models/index.js';
import { postOrder } from '../controllers/index.js';

describe('Order Controller - postOrder', () => {
    before(done => {
        mongoose
            .connect(
                'mongodb+srv://biongoo:VNSgZpPq4JVhm1Qe@cluster0.epcnv.mongodb.net/rental-app-test?retryWrites=true&w=majority',
            )
            .then(result => {
                const car = new Car({
                    name: 'BMW M5 GTS',
                    pricePerDay: 2500,
                    url: 'http://localhost:8080/images/BMW.webp',
                    _id: '5c0f66b979af55031b34728a',
                });
                return car.save();
            })
            .then(result => {
                done();
            });
    });

    after(done => {
        Car.deleteMany({})
            .then(() => Order.deleteMany({}))
            .then(() => Payment.deleteMany({}))
            .then(() => mongoose.disconnect())
            .then(() => {
                done();
            });
    });

    it('Error while endDate is earlier than startDate', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const today = new Date();

        const req = {
            body: {
                carId: '5c0f66b979af55031b34728a',
                email: 'test@wp.pl',
                name: 'Test name',
                phone: '123123123',
                startDate: tomorrow,
                endDate: today,
            },
        };

        postOrder(req, {}, () => {}).then(error => {
            expect(error.message).to.be.equal('Invalid dates');
        });
    });

    it('Error while startDate is earlier than now', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const today = new Date();

        const req = {
            body: {
                carId: '5c0f66b979af55031b34728a',
                email: 'test@wp.pl',
                name: 'Test name',
                phone: '123123123',
                startDate: yesterday,
                endDate: today,
            },
        };

        postOrder(req, {}, () => {}).then(error => {
            expect(error.message).to.be.equal(
                'Start date can not be earlier than now.',
            );
        });
    });

    it('Error while wrong car id', () => {
        const req = {
            body: {
                carId: '5c0f66b979af55031b3472',
                email: 'test@wp.pl',
                name: 'Test name',
                phone: '123123123',
                startDate: new Date(),
                endDate: new Date(),
            },
        };

        postOrder(req, {}, () => {}).then(error => {
            expect(error.message).to.be.equal('Invalid car id');
        });
    });

    it('Error while can not find car', () => {
        const req = {
            body: {
                carId: '5c0f66b979af55031b34728b',
                email: 'test@wp.pl',
                name: 'Test name',
                phone: '123123123',
                startDate: new Date(),
                endDate: new Date(),
            },
        };

        postOrder(req, {}, () => {}).then(error => {
            expect(error.message).to.be.equal('There is no such car');
        });
    });

    it('Response with paymentId', () => {
        const req = {
            body: {
                carId: '5c0f66b979af55031b34728a',
                email: 'test@wp.pl',
                name: 'Test name',
                phone: '123123123',
                startDate: new Date(),
                endDate: new Date(),
            },
        };

        const res = {
            data: {},
            status() {
                return this;
            },
            json(x) {
                this.data = x.data;
            },
        };

        postOrder(req, res, () => {}).then(() => {
            expect(res.data).to.have.property('paymentId');
        });
    });
});
