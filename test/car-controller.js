import { expect } from 'chai';
import mongoose from 'mongoose';

import { Car } from '../models/index.js';
import { getCars, postCars } from '../controllers/index.js';

describe('Car Controller', () => {
    before(done => {
        mongoose
            .connect(
                'mongodb+srv://biongoo:VNSgZpPq4JVhm1Qe@cluster0.epcnv.mongodb.net/rental-app-test?retryWrites=true&w=majority',
            )
            .then(result => {
                done();
            });
    });

    after(done => {
        Car.deleteMany({})
            .then(() => mongoose.disconnect())
            .then(() => {
                done();
            });
    });

    describe('postCars', () => {
        it('Create mock cars', () => {
            const res = {
                data: '',
                status() {
                    return this;
                },
                json(x) {
                    this.data = x.data;
                },
            };

            postCars({}, res, () => {}).then(() => {
                expect(res.data).to.be.equal('Added');
            });
        });
    });

    describe('getCars', () => {
        it('Get cars from database', () => {
            const res = {
                data: '',
                status() {
                    return this;
                },
                json(x) {
                    this.data = x.data;
                },
            };

            getCars({}, res, () => {}).then(() => {
                expect(res.data).to.be.an('array');
            });
        });
    });
});
