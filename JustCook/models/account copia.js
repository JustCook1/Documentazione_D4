const mongoose = require("mongoose");
const Credenziali = require ("./models/credenziali");
const Ricetta = require ("./models/ricetta");


const AccountSchema = new mongoose.Schema({
    credenziali: Credenziali,
    imgutente: String,
    preferiti:[Ricetta]
});

const Account = mongoose.model ('Account', AccountSchema);
module.exports = Account;

