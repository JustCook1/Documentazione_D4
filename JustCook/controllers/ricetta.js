const Ricetta = require("../models/ricetta");

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


module.exports = {
    //TODO inserisci qui il nome delle funzioni implementate
    getRicetta,
    postNuovaRicetta
};