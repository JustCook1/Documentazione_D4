const mongoose = require("mongoose"); //import mongoose

const RicettaEstesaSchema = new mongoose.Schema({

    descrizione : String,
    passaggi : Array, //array di stringhe
    ingredienti : Array,
    ratingDato : Number

});

const RicettaEstesa = mongoose.model('RicettaEstesa', RicettaEstesaSchema); //convert to model named RicettaEstesa
module.exports = RicettaEstesa; //export for controller use