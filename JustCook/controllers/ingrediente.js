const Ingrediente = require('../models/ingrediente');

//aggiungi ingrediente
const postNuovoIngrediente = (req, res) => {
    //console.log("entro in postNuovoIngrediente");
    Ingrediente.findOne({nome: req.body.nome}, (err, data) => {
        if (data) return res.json({error: "Ingrediente già presente", code: 403});
        const nuovoIngrediente = new Ingrediente({
            nome: req.body.nome,
            tipo: req.body.tipo,
        });
        nuovoIngrediente.save((err, data) => {
            if (err) return res.json({error: "Errore nell'inserimento", code: 500});
            res.json(data);
        });
    });
};

//cerca ingrediente per nome
const cercaIngrediente = (req, res) => {
    let nomeIngrediente = req.params.nome;
    Ingrediente.findOne({nome: nomeIngrediente}, (err, Ingrediente) => {
        if (!Ingrediente || err) return res.json({error: "Ingrediente non trovato", code: 404});
        res.json(Ingrediente);
    });
};

//elimina ingrediente
//solo per testing su postman
const eliminaIngrediente = (req, res) => {
    let nomeIngrediente = req.params.nome;
    Ingrediente.findOne({nome: nomeIngrediente}, (err, Ingrediente) => {
        if (!Ingrediente || err) return res.json({error: "Ingrediente non trovato", code: 404});
        Ingrediente.deleteOne({nome: nomeIngrediente}, (err, Ingrediente) => {
            if (err) return res.json({error: "Errore nell'eliminazione", code: 500});
            res.json(Ingrediente);
        });
    });
};


module.exports = {
    postNuovoIngrediente,
    cercaIngrediente,
    eliminaIngrediente
};