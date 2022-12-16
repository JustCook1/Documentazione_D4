const mongoose = require("mongoose");


const FiltroSchema = new mongoose.Schema({
    nome: String,
    selezionato: {type:Boolean, default: false}  
});


const Filtro = mongoose.model ('Filtro', FiltroSchema);

module.exports = Filtro;
