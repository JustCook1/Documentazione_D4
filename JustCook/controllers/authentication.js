const express = require('express');
const router = express.Router();
const Account = require('../models/account'); 

require('dotenv').config();

//funzione che prende username e password e controlla se esiste un account con quelle credenziali
const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const account = await Account.findOne({username: username, password: password});
    if (!account || account == null) 
        res.json({error: "Account non trovato", code: 404});
    else res.json({username: account.username, code: 200});
};

module.exports = {login};