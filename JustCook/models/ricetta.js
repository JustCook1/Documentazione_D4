const mongoose = require("mongoose"); //import mongoose

//const filtroModel = require ("./filtro");

const RicettaSchema = new mongoose.Schema({

    nome : {type: String, required: true},
    autore : {type: String, required: true},
    statistica : [{type: String}],
    primoCompletamento : Boolean,
    salvata : Boolean,
    filtri : Array,  //array, da decidere se di filtri o di stringhe in base implem.
    //filtri: [{type: Object}], -> se voglio filtri come oggetto filtro
    //filtri: [{type: mogoose.Schema.Types.ObjectId, ref: Filtro}], -> se voglio filtri come oggetto filtri (con reference)
    //filtri: [{String}], -> se voglio filtri come stringe
    rating : Number

});

const Ricetta = mongoose.model('Ricetta', RicettaSchema); //convert to model named Ricetta
module.exports = Ricetta; //export for controller use