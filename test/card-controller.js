import { expect } from 'chai';
import mongoose from 'mongoose';

import { Card } from '../models/index.js';
import { getCards, postCards } from '../controllers/index.js';

describe('Card Controller', () => {
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
        Card.deleteMany({})
            .then(() => mongoose.disconnect())
            .then(() => {
                done();
            });
    });

    describe('postCards', () => {
        it('Create mock cards', () => {
            const res = {
                data: '',
                status() {
                    return this;
                },
                json(x) {
                    this.data = x.data;
                },
            };

            postCards({}, res, () => {}).then(() => {
                expect(res.data).to.be.equal('Added cards');
            });
        });
    });

    describe('getCards', () => {
        it('Get cards from database', () => {
            const res = {
                data: '',
                status() {
                    return this;
                },
                json(x) {
                    this.data = x.data;
                },
            };

            getCards({}, res, () => {}).then(() => {
                expect(res.data).to.be.an('array');
            });
        });
    });
});
