const multer = require('multer');
const upload = multer();
const mongoose = require("mongoose"); 
const Ricetta = require("../models/ricetta");
const e = require('express');

//inserisci qui la buisness logic

//get ricetta per nome, filtri
const cercaRicette = (req, res) => {
    let nome = req.params.nome;
    let filtri = req.params.filtri;
    if(!filtri){
        Ricetta.find({nome: nome}, (err, Ricetta) => {
            if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
            res.json(Ricetta);
        });
    }
    else{
        Ricetta.find({nome: nome, filtri: filtri}, (err, Ricetta) => {
            if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
            res.json(Ricetta);
        });
    }
};

//come implemento la ricerca per dispensa?
//la dispensa è parte di account?
//come faccio a scorrere ogni ingrediente della dispensa e cercare ricette che contengano tutti gli ingredienti?
//come faccio a scorrere ogni ingrediente della dispensa e cercare ricette che contengano almeno uno degli ingredienti?

const cercaPerDispensa = (req, res) => {
    let dispensa = req.params.dispensa;
    let filtri = req.params.filtri;
    if(!filtri){
        Ricetta.find({dispensa: dispensa}, (err, Ricetta) => {
            if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
            res.json(Ricetta);
        });
    }else{
        Ricetta.find({dispensa: dispensa, filtri: filtri}, (err, Ricetta) => {
            if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
            res.json(Ricetta);
        });
    }

};

module.exports = {
    //TODO inserisci qui il nome delle funzioni implementate
    cercaRicette,
    cercaPerDispensa
};