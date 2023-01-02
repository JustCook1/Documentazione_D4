const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

//test per le api di account

describe('Test per le api di account', () => {

    //aspetto che la connessione al db sia stabilita
    beforeAll( async () => { jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.MONGODB_URI); });
    afterAll( () => { mongoose.connection.close(true); });

    //test per aggiungiAiPreferiti
    test('Test per aggiungiAiPreferiti', async () => {
        const res = await request(app).patch('/aggiungiAiPreferiti').send({ricetta : "formaggio con le pere", autore : "juj", account : "pippo"});
        expect(res.statusCode).toEqual(200);
    });
    
    //test per togliDaiPreferiti
    test('Test per togliDaiPreferiti', async () => {
        const res = await request(app).patch('/togliDaiPreferiti').send({ricetta : "formaggio con le pere", autore : "juj", account : "pippo"});
        expect(res.statusCode).toEqual(200);
    });

    //test per aggiungiRating (mi aspetto un errore perchè ho già dato un rating)
    test('Test per aggiungiRating', async () => {
        const res = await request(app).patch('/aggiungiRating').send({ricetta : "formaggio con le pere", autore : "juj", account : "pippo", rating : 5});
        expect(res.statusCode).toEqual(400);
    });

    //test completaRicetta (mi aspetto un errore perchè ho già completato la ricetta)
    test('Test per completaRicetta', async () => {
        const res = await request(app).patch('/completaRicetta').send({ricetta : "formaggio con le pere", autore : "juj", account : "pippo"});
        expect(res.statusCode).toEqual(404);
    });

    //test per getMail
    test('Test per getMail', async () => {
        const res = await request(app).get('/account/sos@mail.cccccccccccccc');
        expect(res.statusCode).toEqual(200);
    });

    //test per patchPassword
    test('Test per patchPassword', async () => {
        const res = await request(app).patch('/account/sos@mail.cccccccccccccc/NuovaPassword123!');
        expect(res.statusCode).toEqual(200);
    });


});