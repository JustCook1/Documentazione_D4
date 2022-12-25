const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

//TODO aggiungere le routes
//SE NON FUNZIONA PROBABILMENTE MANCANO LE ROUTE


const ingrediente = require('./routes/ingrediente');
const ricetta = require('./routes/ricetta');
const dispensa = require('./routes/dispensa');


const mongoose = require('mongoose');
app.use(express.json());

//GB: qui vanno le routes
//non so se è corretto mettere le routes qui, ma non so dove metterle
app.use('/', ingrediente);
app.use('/', ricetta);
app.use('/', dispensa);


mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
