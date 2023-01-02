const mongoose = require("mongoose");
const Ricetta = require ("./ricetta");


const AccountSchema = new mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true},
    indirizzoEmail: {type: String, required:true},
    imgUtente: String,
    preferiti: [{type: mongoose.Schema.Types.ObjectId, ref:Ricetta}], 
    primiCompletamenti: [{type: mongoose.Schema.Types.ObjectId, ref:Ricetta}],
    ratingDati: [{ricetta: {type: mongoose.Schema.Types.ObjectId, ref:Ricetta}, ratingDato: Number}]

});

const Account = mongoose.model ('Account', AccountSchema);
module.exports = Account;

