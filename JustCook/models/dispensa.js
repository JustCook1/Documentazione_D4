const mongoose = require("mongoose"); 
const Ingrediente = require("./ingrediente");

const DispensaSchema = new mongoose.Schema({
ingredienti: {type:Ingrediente, required:true}
});

const Dispensa = mongoose.model('Dispensa', DispensaSchema); 
module.exports = Dispensa; 