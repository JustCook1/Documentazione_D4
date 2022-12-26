require('dotenv').config()
const express = require('express');
const app = express();

//routes generiche

const routesAccount = require('./routes/account');
const routesRicetta = require('./routes/ricetta');
const routesRicettaEstesa = require('./routes/ricettaEstesa');
const routesIngrediente = require('./routes/ingrediente');
const routesDispensa = require('./routes/dispensa');
//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routesAccount); 
app.use('/', routesRicetta); 
app.use('/', routesRicettaEstesa); 
app.use('/', routesDispensa); 
app.use('/', routesIngrediente); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = app;