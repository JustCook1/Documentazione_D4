const mongoose = require("mongoose"); 

const IngredienteSchema = new mongoose.Schema({
nome: {type:String, required:true},
tipo: {type:String, required:true} // se è un ingrediente in grammi o unità
});

const Ingrediente = mongoose.model('Ingrediente', IngredienteSchema);
module.exports =  Ingrediente; 