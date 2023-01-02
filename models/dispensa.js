const mongoose = require("mongoose"); 
const Ingrediente = require ('./ingrediente');

//GB: i parametri di dispensa non possono essere required perchè prima va creata la dispensa, poi va popolata
const DispensaSchema = new mongoose.Schema({
    ingredienti: [{type:mongoose.Schema.Types.ObjectId, ref: Ingrediente}],
    quantita: [{type: Number}],
    account : {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true}
});

const Dispensa = mongoose.model('Dispensa', DispensaSchema); 
module.exports = Dispensa; 