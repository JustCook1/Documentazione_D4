const Dispensa = require('../models/dispensa');
const Account = require('../models/account');
const Ingrediente = require('../models/ingrediente');
const multer = require('multer');
const upload = multer();    //GB: lol non credo serva, ma senza non funziona
const mongoose = require("mongoose"); 
const e = require('express');

//crea una nuova dispensa per l'utente avente nome = nomeAccount
const nuovaDispensa = (req, res) => {
    let nomeAccount = req.body.nome;
    Account.findOne({username: nomeAccount}, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: mongoose.Types.ObjectId(account._id)}, (err, dispensa) => {
            if (dispensa || err) return res.json({error: "Dispensa già esistente", code: 404});
            let nuovaDispensa = new Dispensa({
                account: account._id,
                ingredienti: [],
                quantita: []
            });
            nuovaDispensa.save((err, dispensa) => {
                if (err) return res.json({error: "Errore durante la creazione della dispensa", code: 500});
                res.json(dispensa);
            });
        });
    });
};

//get dispensa per l'utente avente nome = nomeAccount
const getDispensa = (req, res) => {
    let nomeAccount = req.params.nome;
    Account.findOne({username: nomeAccount}, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: mongoose.Types.ObjectId(account._id)}, (err, dispensa) => {
            if (!dispensa || err) return res.json({error: "Dispensa non trovata", code: 404});
            res.json(dispensa);
        });
    });
};

//crea una dispensa legata a un token di sessione


//metodo patch per aggiungere un oggetto ingrediente alla dispensa associata all'utente avente nome = nomeAccount
const aggiungiIngrediente = (req, res) => {
    let nomeAccount = req.body.nome;
    let idIngrediente = mongoose.Types.ObjectId(req.body.idIngrediente);
    
    Account.findOne({username: nomeAccount}, (err, account) => {
        if (!account || err) return res.json({error: "Account non trovato", code: 404});
        Dispensa.findOne({account: account._id}, (err, dispensa) => {
            if (!dispensa || err) return res.json({error: "Dispensa non trovata", code: 404});
            let index = dispensa.ingredienti.indexOf(idIngrediente);
            if (index == -1) {
                dispensa.ingredienti.push(idIngrediente);
                dispensa.quantita.push(req.body.quantita);
            } else {

                let quantita_attuale = dispensa.quantita[index];
                //senza il casting a Number non funziona
                dispensa.quantita[index] = Number(quantita_attuale) + Number(req.body.quantita);
            }
            dispensa.save((err, data) => {
                if (err) return res.json({error: "Errore nell'aggiunta", code: 500});
                res.json(data);
            });
        });
    });
};

//GB: non è detto che l'ingrediente non sia già presente nella dispensa, ma non so come gestire questo caso


//patch modifica quantita ingrediente dalla dispensa associata all'utente avente nome = nomeAccount
const modificaQuantita = (req, res) => {
    let nomeAccount = req.params.nome;
    let idIngrediente = req.body.idIngrediente;
    let quantita = req.body.quantita;
    Account.findOne({username: nomeAccount}, (err, account) => {
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

//patch elimina ingrediente dalla dispensa associata all'utente avente nome = nomeAccount
const eliminaIngrediente = (req, res) => {
    let nomeAccount = req.body.nome;
    console.log(nomeAccount);
    let idIngrediente = req.body.idIngrediente;
    Account.findOne({username: nomeAccount}, (err, account) => {
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