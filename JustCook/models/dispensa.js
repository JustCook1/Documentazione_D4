const mongoose = require("mongoose"); 
//const Ingrediente = require("./ingrediente");

const DispensaSchema = new mongoose.Schema({
    ingredienti:[{type: Object, required: true}]
//ingredienti: [{type:mongoose.Schema.Types.ObjectId, ref: 'Ingrediente', required:true}]
});

const Dispensa = mongoose.model('Dispensa', DispensaSchema); 
module.exports = Dispensa; 