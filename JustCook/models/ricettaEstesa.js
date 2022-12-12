const mongoose = require("mongoose"); //import mongoose
const Ricetta = require('./ricetta'); //import del modello ricetta

const RicettaEstesaSchema = new mongoose.Schema({

    ricetta : Ricetta, //associa ogni ricetta estesa a una ricetta
    descrizione : String,
    passaggi : Array, //array di stringhe
    ingredienti : Array,
    ratingDato : Number

});

const RicettaEstesa = mongoose.model('RicettaEstesa', RicettaEstesaSchema); //convert to model named RicettaEstesa
module.exports = RicettaEstesa; //export for controller use