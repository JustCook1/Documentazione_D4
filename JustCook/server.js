const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

const routesAccount = require('./routes/account');
const routesRicetta = require('./routes/ricetta');
const routesRicettaEstesa = require('./routes/ricettaEstesa');
const routesIngrediente = require('./routes/ingrediente');
const routesDispensa = require('./routes/dispensa');

const mongoose = require('mongoose');
app.use(express.json());

app.use('/', routesAccount); 
app.use('/', routesRicetta); 
app.use('/', routesRicettaEstesa); 
app.use('/', routesDispensa); 
app.use('/', routesIngrediente); 

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);


const listener = app.listen(process.env.PORT || 8080, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
