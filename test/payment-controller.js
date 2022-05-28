import { expect } from 'chai';
import mongoose from 'mongoose';

import { Car, Card, Order, Payment } from '../models/index.js';
import { createClearDate } from '../utils/index.js';
import { getPayment, updatePayment } from '../controllers/index.js';

describe('Payment Controller', () => {
    before(done => {
        mongoose
            .connect(
                'mongodb+srv://biongoo:VNSgZpPq4JVhm1Qe@cluster0.epcnv.mongodb.net/rental-app-test?retryWrites=true&w=majority',
            )
            .then(() => {
                const car = new Car({
                    name: 'BMW M5 GTS',
                    pricePerDay: 2500,
                    url: 'http://localhost:8080/images/BMW.webp',
                    _id: '5c0f66b979af55031b34728a',
                });
                return car.save();
            })
            .then(() => {
                const order = new Order({
                    name: 'Test name',
                    phone: '123456789',
                    email: 'test@wp.pl',
                    startDate: createClearDate(new Date()),
                    endDate: createClearDate(new Date()),
                    car: '5c0f66b979af55031b34728a',
                    _id: '5c0f66b979af55031b34728b',
                });

                return order.save();
            })
            .then(() => {
                const payment = new Payment({
                    status: 'new',
                    value: 2500,
                    days: 1,
                    order: '5c0f66b979af55031b34728b',
                    _id: '5c0f66b979af55031b34728c',
                });
                return payment.save();
            })
            .then(() => {
                done();
            });
    });

    after(done => {
        Payment.deleteMany({})
            .then(() => Order.deleteMany({}))
            .then(() => Car.deleteMany({}))
            .then(() => Card.deleteMany({}))
            .then(() => mongoose.disconnect())
            .then(() => {
                done();
            });
    });

    describe('getPayment', () => {
        it('Error while wrong payment id', done => {
            const req = { params: { paymentId: '5c0f66b979af550' } };

            getPayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal('Invalid payment id');
                done();
            });
        });

        it('Error while can not find payment', done => {
            const req = { params: { paymentId: '5c0f66b979af55031b34728b' } };

            getPayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal('Could not find payment.');
                done();
            });
        });

        it('Response with payment', done => {
            const req = { params: { paymentId: '5c0f66b979af55031b34728c' } };

            const res = {
                data: undefined,
                status() {
                    return this;
                },
                json(x) {
                    this.data = x.data;
                },
            };

            getPayment(req, res, () => {}).then(() => {
                expect(res.data?._id).to.be.an('object');
                done();
            });
        });
    });

    describe('updatePayment', () => {
        beforeEach(done => {
            Payment.deleteMany({})
                .then(() => Card.deleteMany({}))
                .then(() => {
                    const payment = new Payment({
                        status: 'new',
                        value: 2500,
                        days: 1,
                        order: '5c0f66b979af55031b34728b',
                        _id: '5c0f66b979af55031b34728c',
                    });
                    return payment.save();
                })
                .then(() => {
                    const card = new Card({
                        isBlocked: false,
                        errorCount: 0,
                        amount: 5000,
                        number: 1234123412341234,
                        expiresMonth: 2,
                        expiresYear: new Date().getFullYear() + 2,
                        cvc: 321,
                    });

                    return card.save();
                })
                .then(() => {
                    done();
                });
        });

        it('Error while wrong payment id', done => {
            const req = {
                body: {
                    card: 1,
                    cvc: 1,
                    mm: 1,
                    yy: 1,
                },
                params: { paymentId: '5c0f66b979af550' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal('Invalid payment id');
                done();
            });
        });

        it('Error while can not find payment', done => {
            const req = {
                body: {
                    card: 1,
                    cvc: 1,
                    mm: 1,
                    yy: 1,
                },
                params: { paymentId: '5c0f66b979af55031b34728b' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal('Could not find payment.');
                done();
            });
        });

        it('Error while payment is paid', done => {
            const req = {
                body: {
                    card: 1,
                    cvc: 1,
                    mm: 1,
                    yy: 1,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            Payment.findByIdAndUpdate('5c0f66b979af55031b34728c', {
                status: 'paid',
            })
                .then(() => {
                    return updatePayment(req, {}, () => {});
                })
                .then(error => {
                    expect(error.message).to.be.equal('Your payment was paid!');
                    done();
                });
        });

        it('Error while year is earlier than now', done => {
            const req = {
                body: {
                    card: 1,
                    cvc: 1,
                    mm: 1,
                    yy: 2021,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal('Your card is expired!');
                done();
            });
        });

        it('Error while year is correct but month is earlier than now', done => {
            if (new Date().getMonth() === 0) {
                done();
            }

            const req = {
                body: {
                    card: 1,
                    cvc: 1,
                    mm: new Date().getMonth(),
                    yy: new Date().getFullYear(),
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal('Your card is expired!');
                done();
            });
        });

        it('Error while can not find card in database', done => {
            const req = {
                body: {
                    card: 1234123412341235,
                    cvc: 1,
                    mm: 0,
                    yy: new Date().getFullYear() + 1,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal(
                    'There is no such card number',
                );
                done();
            });
        });

        it('Error while card is blocked', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 1,
                    mm: 0,
                    yy: new Date().getFullYear() + 1,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            Card.findOneAndUpdate(
                { number: 1234123412341234 },
                {
                    isBlocked: true,
                },
            )
                .then(() => {
                    return updatePayment(req, {}, () => {});
                })
                .then(error => {
                    expect(error.message).to.be.equal(
                        'Your card is blocked! Contact your bank to unlock.',
                    );
                    done();
                });
        });

        it('Error while cvc is wrong', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 1,
                    mm: 0,
                    yy: new Date().getFullYear() + 1,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal(
                    'Your card details are invalid!',
                );
                done();
            });
        });

        it('Error while expiresMonth is wrong', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 321,
                    mm: 0,
                    yy: new Date().getFullYear() + 2,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal(
                    'Your card details are invalid!',
                );
                done();
            });
        });

        it('Error while expiresYear is wrong', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 321,
                    mm: 2,
                    yy: new Date().getFullYear() + 1,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {}).then(error => {
                expect(error.message).to.be.equal(
                    'Your card details are invalid!',
                );
                done();
            });
        });

        it('Error while amount is too low', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 321,
                    mm: 2,
                    yy: new Date().getFullYear() + 2,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            Card.findOneAndUpdate(
                { number: 1234123412341234 },
                {
                    amount: 100,
                },
            )
                .then(() => {
                    return updatePayment(req, {}, () => {});
                })
                .then(error => {
                    expect(error.message).to.be.equal(
                        'You do not have enough funds to complete the transaction.',
                    );
                    done();
                });
        });

        it('Error while 3 time pass wrong details (block card)', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 322,
                    mm: 2,
                    yy: new Date().getFullYear() + 2,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            updatePayment(req, {}, () => {})
                .then(() => {
                    return updatePayment(req, {}, () => {});
                })
                .then(() => {
                    return updatePayment(req, {}, () => {});
                })
                .then(() => {
                    return updatePayment(req, {}, () => {});
                })
                .then(error => {
                    expect(error.message).to.be.equal(
                        'Your card is blocked! Contact your bank to unlock.',
                    );
                    done();
                });
        });

        it('Return status="ok" when everything is alright', done => {
            const req = {
                body: {
                    card: 1234123412341234,
                    cvc: 321,
                    mm: 2,
                    yy: new Date().getFullYear() + 2,
                },
                params: { paymentId: '5c0f66b979af55031b34728c' },
            };

            const res = {
                data: undefined,
                status() {
                    return this;
                },
                json(x) {
                    this.data = x.data;
                },
            };

            updatePayment(req, res, () => {}).then(() => {
                expect(res.data.status).to.be.equal('ok');
                done();
            });
        });
    });
});
