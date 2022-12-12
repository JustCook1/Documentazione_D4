const mongoose = require("mongoose");

const CredenzialiSchema = new mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true},
    indirizzoEmail: String,
});

const Credenziali = mongoose.model ('credenziali', CredenzialiSchema);
module.exports = Credenziali;

