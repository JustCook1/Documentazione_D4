const express = require('express');
const router = express.Router();
const Account = require('../models/account'); 

require('dotenv').config();

//funzione che prende username e password e controlla se esiste un account con quelle credenziali
const login = async (req, res) => {
    const {username, password} = req.body;
    const account = await Account.findOne({username: username, password: password});
    if (account) {
        res.json(account);
    } else {
        res.json({error: "Account non trovato", code: 404});
    }
};

module.exports = {login};