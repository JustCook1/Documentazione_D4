const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

//test per le api di authentication

describe('Test per le api di authentication', () => {

    //aspetto che la connessione al db sia stabilita
    beforeAll( async () => { jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.MONGODB_URI); });
    afterAll( () => { mongoose.connection.close(true); });

    //test per login
    test('Test per login', async () => {
        const res = await request(app).post('/login').send({username : "prova", password : "prova"});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username');
    });


});