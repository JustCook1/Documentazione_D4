const mongoose = require("mongoose"); //import mongoose
const Ricetta = require('./ricetta'); 
const Ingrediente = require ('./ingrediente');

const RicettaEstesaSchema = new mongoose.Schema({

    ricetta: {type: mongoose.Schema.Types.ObjectId, ref: Ricetta },
    descrizione : String,
    passaggi : [{type: String}],
    ingredienti: [{type: mongoose.Schema.Types.ObjectId, ref: Ingrediente}],
    quantita: [{type: Number}]

});

const RicettaEstesa = mongoose.model('RicettaEstesa', RicettaEstesaSchema); //convert to model named RicettaEstesa
module.exports = RicettaEstesa; //export for controller use