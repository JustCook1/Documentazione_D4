const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

//test per le api di ingrediente

describe('Test per le api di ingrediente', () => {

    //aspetto che la connessione al db sia stabilita
    beforeAll( async () => { jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.MONGODB_URI); });
    afterAll( () => { mongoose.connection.close(true); });

    //test per getIngredienti
    test('Test per getIngredienti', async () => {
        const res = await request(app).get('/ingrediente/formaggio');
        expect(res.statusCode).toEqual(200);
    });

    //test per creaIngredienteId
    test('Test per creaIngredienteId', async () => {
        const res = await request(app).get('/ingrediente/id/63a72e3fdbf4ec92157444b8');
        expect(res.statusCode).toEqual(200);
    });

});

    //test per getIngredientiRicetta