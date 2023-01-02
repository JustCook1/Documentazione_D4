const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

//test per le api di dispensa
describe('Test per le api di dispensa', () => {
    
    //aspetto che la connessione al db sia stabilita
    beforeAll( async () => { jest.setTimeout(8000);
        app.locals.db = await mongoose.connect(process.env.MONGODB_URI); });
    afterAll( () => { mongoose.connection.close(true); });

    //test per la get di una dispensa
    test('Test per la get di una dispensa', async () => {
        const res = await request(app).get('/dispensa/pippo');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('ingredienti');
        expect(res.body).toHaveProperty('quantita');
    });

    //test per nuova dispensa 
    test('Test per la creazione di una nuova dispensa', async () => {
        const res = await request(app).post('/dispensa').send({nome: 'pippo'});
        expect(res.statusCode).toEqual(200);
    });


    //test per aggiungere un ingrediente alla dispensa
    test('Test per aggiungere un ingrediente alla dispensa', async () => {
        const res = await request(app).patch('/dispensa/aggiungiIngrediente').send({nome: 'pippo', idIngrediente: '63a72e3fdbf4ec92157444b8', quantita: 100});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('ingredienti');
        expect(res.body).toHaveProperty('quantita');
    });

    //test per rimuovere un ingrediente alla dispensa
    test('Test per rimuovere un ingrediente alla dispensa', async () => {
        const res = await request(app).delete('/dispensa/eliminaIngrediente').send({nome: 'pippo', idIngrediente: '63a72e3fdbf4ec92157444b8'});
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('ingredienti');
        expect(res.body).toHaveProperty('quantita');
    });


});