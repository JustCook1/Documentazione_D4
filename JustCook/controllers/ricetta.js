
const multer = require('multer');
const upload = multer();
const mongoose = require("mongoose"); 
const Ricetta = require("../models/ricetta");
const e = require('express');


//inserisci qui la buisness logic

//POST ricetta

const postNuovaRicetta = (req, res) => {
    Ricetta.findOne({nome: req.body.nome, autore: req.body.autore}, (err, data) => {
        if(data) return res.json({error: "Ricetta già presente", code: 403});
        else {
            const newRicetta = new Ricetta({
                nome: req.body.nome,
                autore: req.body.autore,
                statistica: req.body.statistica,
                primoCompletamento: req.body.primoCompletamento,
                salvata: req.body.salvata,
                filtri: req.body.filtri,
                rating: req.body.rating
            });

            //salva la nuova ricetta nel db
            newRicetta.save((err, data) => {
                if (err) return res.json({error: "Errore nel salvataggio", code: 500});
                res.json(data);
            });
            
        }
    });
};

//GET ricetta per nome e autore
const getRicetta = (req, res) => {
    let nomeRicetta = req.params.nome;
    let autoreRicetta = req.params.autore;
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, (err, Ricetta) => {
        if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
        res.json(Ricetta);
    });
};

const aggiungiAiPreferiti = (req, res) => {
    let nomeRicetta = req.params.nome;
    let autoreRicetta = req.params.autore;
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, (err, Ricetta) => {
        if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
        Ricetta.salvata = true;
        Ricetta.save((err, data) => {
            if (err) return res.json({error: "Errore nel salvataggio", code: 500});
            res.json(data);
        });
    });
};


//DA ESEGUIRE SOL SE PRIMOCOMPLETAMENTO = FALSE
//TODO DA IMPLEMENTARE IL CHECK NELLO SCRIPT
const completaRicetta = (req, res) => {
    let nomeRicetta = req.params.nome;
    let autoreRicetta = req.params.autore;
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, (err, Ricetta) => {
        if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
        Ricetta.primoCompletamento = true;
        Ricetta.save((err, data) => {
            if (err) return res.json({error: "Errore nel salvataggio", code: 500});
            res.json(data);
        });
    });
};

//DA ESEGUIRE SOL SE PREFAVORITI = TRUE
//TODO DA IMPLEMENTARE IL CHECK NELLO SCRIPT
const togliDaiPreferiti = (req, res) => {
    let nomeRicetta = req.params.nome;
    let autoreRicetta = req.params.autore;
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, (err, Ricetta) => {
        if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
        Ricetta.salvata = false;
        Ricetta.save((err, data) => {
            if (err) return res.json({error: "Errore nel salvataggio", code: 500});
            res.json(data);
        });
    });
};

const aggiungiRating = (req, res) => {
    let nomeRicetta = req.params.nome;
    let autoreRicetta = req.params.autore;
    let rating = req.params.rating;
    if(rating < 0 || rating > 5) return res.json({error: "Rating non valido", code: 403});
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, (err, Ricetta) => {
        if (!Ricetta || err) return res.json({error: "Ricetta non trovata", code: 404});
        Ricetta.rating = rating;
        Ricetta.save((err, data) => {
            if (err) return res.json({error: "Errore nel salvataggio", code: 500});
            res.json(data);
        });
    });
};

/*  da mettere in ricetta estesa
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
*/

module.exports = {
    //TODO inserisci qui il nome delle funzioni implementate
    getRicetta,
    postNuovaRicetta,
    aggiungiAiPreferiti,
    completaRicetta,
    togliDaiPreferiti,
    aggiungiRating
};