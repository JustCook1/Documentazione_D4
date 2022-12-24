const mongoose = require("mongoose"); //import mongoose

const RicettaSchema = new mongoose.Schema({

    nome : {type: String, required: true},
    autore : {type: String, required: true},
    statistica : [{type: String}],
    filtri : [{type: String}],  
    rating : Number

});

const Ricetta = mongoose.model('Ricetta', RicettaSchema); //convert to model named Ricetta
module.exports = Ricetta; //export for controller use