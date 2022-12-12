const mongoose = require("mongoose"); 

const IngredienteSchema = new mongoose.Schema({
nome: {type:String, required:true},
quantità: {int, required:true},
});

const Ingrediente = mongoose.model('Ingrediente', IngredienteSchema);
module.exports =  Ingrediente; 