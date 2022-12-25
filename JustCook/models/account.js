const mongoose = require("mongoose");
const Ricetta = require ("./ricetta");


const AccountSchema = new mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true},
    indirizzoEmail: {type: String, required:true},
    imgUtente: String,
    preferiti: [{type: mogoose.Schema.Types.ObjectId, ref:Ricetta}], 
    //dispensa: {type: mogoose.Schema.Types.ObjectId, ref:Dispensa},
    primiCompletamenti: [{type: mogoose.Schema.Types.ObjectId, ref:Ricetta}],
    ratingDati: [{type: Int}]

});

const Account = mongoose.model ('Account', AccountSchema);
module.exports = Account;

