const mongoose = require("mongoose");
//const Credenziali = require ("./credenziali");
//const Ricetta = require ("./ricetta");


const AccountSchema = new mongoose.Schema({
    credenziali: {type: Object, required: true},
    //credenziali: {type: mogoose.Schema.Types.ObjectId, ref:'Credenzaili', required: true},
    imgutente: String,
    preferiti:[{type:Object}]
    //preferiti: [{type: mogoose.Schema.Types.ObjectId, ref:'Ricetta'}],
});

const Account = mongoose.model ('Account', AccountSchema);
module.exports = Account;

