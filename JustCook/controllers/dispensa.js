const Dispensa = require('../models/dispensa');
const Account = require('../models/account');
const multer = require('multer');
const upload = multer();    //GB: lol non credo serva, ma senza non funziona
const mongoose = require("mongoose"); 
const e = require('express');

//crea una nuova dispensa per l'utente avente id = idAccount
const nuovaDispensa = (req, res) => {
    let idAccount = req.params.id;
    Account.findById(idAccount, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        let nuovaDispensa = new Dispensa({
            ingredienti: [],
            quantita: [],
            account: account._id
        });
        nuovaDispensa.save((err, data) => {
            if (err) return res.json({error: "Errore nella creazione", code: 500});
            res.json(data);
        });
    });
};

//get dispensa per l'utente avente id = idAccount
const getDispensa = (req, res) => {
    let idAccount = req.params.id;
    Account.findById(idAccount, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: account._id}, (err, dispensa) => {
            if (!dispensa || err) return res.json({error: "Dispensa non trovata", code: 404});
            res.json(dispensa);
        });
    });
};

//crea una dispensa legata a un token di sessione


//metodo patch per aggiungere un ingrediente alla dispensa associata all'utente avente id = idAccount
//GB: non è detto che l'ingrediente non sia già presente nella dispensa, ma non so come gestire questo caso
const aggiungiIngrediente = (req, res) => {
    let idAccount = req.params.id;
    let idIngrediente = req.body.idIngrediente;
    let quantita = req.body.quantita;
    Account.findById(idAccount, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: account._id}, (err, dispensa) => {
            if (!dispensa || err) return res.json({error: "Dispensa non trovata", code: 404});
            dispensa.ingredienti.push(idIngrediente);
            dispensa.quantita.push(quantita);
            dispensa.save((err, data) => {
                if (err) return res.json({error: "Errore nell'aggiunta", code: 500});
                res.json(data);
            });
        });
    });
};

//patch modifica quantita ingrediente dalla dispensa associata all'utente avente id = idAccount
const modificaQuantita = (req, res) => {
    let idAccount = req.params.id;
    let idIngrediente = req.body.idIngrediente;
    let quantita = req.body.quantita;
    Account.findById(idAccount, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: account._id}, (err, dispensa) => {
            if (!dispensa || err) return res.json({error: "Dispensa non trovata", code: 404});
            let index = dispensa.ingredienti.indexOf(idIngrediente);
            dispensa.quantita[index] = quantita;
            dispensa.save((err, data) => {
                if (err) return res.json({error: "Errore nell'aggiunta", code: 500});
                res.json(data);
            });
        });
    });
};

//patch elimina ingrediente dalla dispensa associata all'utente avente id = idAccount
const eliminaIngrediente = (req, res) => {
    let idAccount = req.params.id;
    let idIngrediente = req.body.idIngrediente;
    Account.findById(idAccount, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: account._id}, (err, dispensa) => {
            if (!dispensa || err) return res.json({error: "Dispensa non trovata", code: 404});
            let index = dispensa.ingredienti.indexOf(idIngrediente);
            dispensa.ingredienti.splice(index, 1);
            dispensa.quantita.splice(index, 1);
            dispensa.save((err, data) => {
                if (err) return res.json({error: "Errore nell'aggiunta", code: 500});
                res.json(data);
            });
        });
    });
};


module.exports = {
    aggiungiIngrediente,
    nuovaDispensa,
    getDispensa,
    modificaQuantita,
    eliminaIngrediente
};