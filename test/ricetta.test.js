const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

//test per le api di ricetta
describe('Test per le api di ricetta', () => {

    //aspetto che la connessione al db sia stabilita
    beforeAll(async () => {
        jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.MONGODB_URI);
    });
    afterAll(() => { mongoose.connection.close(true); });

    //test per getRicetta
    test('Test per getRicetta', async () => {
        const res = await request(app).get('/ricetta/formaggio con le pere/juj');
        expect(res.statusCode).toEqual(200);
    });


});