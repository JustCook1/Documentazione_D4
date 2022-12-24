const mongoose = require("mongoose"); //import mongoose


//const ricettaModel = require('./ricetta'); -> import del modello ricetta
//const ingredienteModel = require ('./ingrediente); -> import del modello ingrediente

const RicettaEstesaSchema = new mongoose.Schema({

    ricetta : Object, //associa ogni ricetta estesa a una ricetta
    //ricetta: {type: mogoose.Schema.Types.ObjectId, ref: Ricetta },
    descrizione : String,
    passaggi : [{type: String}],
    ingredienti : [{type: Object}],
    //ingredienti: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ingrediente'],
    ratingDato : Number

});

const RicettaEstesa = mongoose.model('RicettaEstesa', RicettaEstesaSchema); //convert to model named RicettaEstesa
module.exports = RicettaEstesa; //export for controller use