const mongoose = require("mongoose");

//import mongoose

const FiltroSchema = new mongoose.Schema({
    nome: String,
    selezionato: {type:Boolean, default: false}  
});

// creato schema account con credenziali, immagine profilo e array preferiti

const Filtro = mongoose.model ('Filtro', FiltroSchema);

//schema convertito in un modello account 

module.exports = Filtro;

//esporatto per utilizzarlo