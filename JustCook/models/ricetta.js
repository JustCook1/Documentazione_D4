const mongoose = require("mongoose"); //import mongoose

const RicettaSchema = new mongoose.Schema({

    nome : String,
    autore : String,
    statistica : Array, //array di Stringhe
    primoCompletamento : Boolean,
    salvata : Boolean,
    filtri : Array,  //array, da decidere se di filtri o di stringhe in base implem.
    rating : Number

});

const Ricetta = mongoose.model('Ricetta', RicettaSchema); //convert to model named Ricetta
module.exports = Ricetta; //export for controller use