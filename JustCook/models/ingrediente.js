const mongoose = require("mongoose"); 

const IngredienteSchema = new mongoose.Schema({
nome: {type:String, required:true},
quantità: {type: Number, required:true, default: 0},
});

const Ingrediente = mongoose.model('Ingrediente', IngredienteSchema);
module.exports =  Ingrediente; 