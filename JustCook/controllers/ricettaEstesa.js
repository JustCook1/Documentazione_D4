const Ricetta = require("../models/ricettaEstesa");

//GET restituisce ricette con:: nome + autore + rating + statistiche
// NOTA: bisogna ritornare solo le ricette che contengono un sottoinsieme degli ingredienti della dispensa
// ECCEZIONE: sale, acqua, pepe, olio, zucchero

const cercaRicette = (req, res, next) => {
    //in input prende: 2 array di stringhe (per ingredienti e filtri), stringa per nome

    let ingredientiLista = req.body.ingredienti; 
    let filtriLista = req.body.filtri;
    let nomeRicetta = req.body.nome;
    let ingredientiBasici = ["Sale", "Zucchero", "Acqua", "Olio"];

    if(ingredientiLista == null){
        // la dispensa è vuota
        console.log("Ricerca impossibile, non esiste alcun ingrediente nella dispensa")
        return res.json({message: "Warning: ricerca impossibile, non esiste alcun ingrediente nella dispensa"})

    }else{
        //aggiunta ELEMENTI BASICI all'array di input (non inseriamo i duplicati)
        ingredientiLista =  ingredientiLista.concat(ingredientiBasici);
        ingredientiLista.sort(); // ordina 
        let stringaPrec = ingredientiLista[0];

        for(let i = 0; i < ingredientiLista.length -1; i++){
            if(ingredientiLista[i+1] == stringaPrec){
                ingredientiLista.splice(i, 1);
            }
            stringaPrec = ingredientiLista[i];
        }

        //sistema di sicurezza ulteriore:: se nomeRicetta = "", quindi nullo lo si setta a null (lo stesso problema non esiste per filtri)
        if(nomeRicetta == "")
            nomeRicetta = null;

        Ricetta.aggregate([
            //1. join tra i record degli ingredienti nel db e gli ingredienti della ricetta
            { $lookup: {from: "ingredientis", localField: "ingredienti", foreignField: "_id", as: "ingredientiInfo"}},
            //2. join tra i record delle ricette nel db e la ricetta referenced in ricettaEstesa
            { $lookup: {from: "ricettas", localField: "ricetta", foreignField: "_id", as: "ricettaInfo"}},
            //3. match filtri e ingredienti
            { $match: { $expr: {$setIsSubset: [filtriLista, "$ricettaInfo.filtri"]} , $expr: {$setIsSubset: ["$ingredientiInfo.nome", ingredientiLista]},
            $expr: {$eq:["$ricettaInfo.nome", {$ifNull: [nomeRicetta, "$ricettaInfo.nome"]} ]} }},
            //4. riassumi valori da ritornare
            { $project: { "nome": {"$first": "$ricettaInfo.nome"}, "autore": {"$first": "$ricettaInfo.autore"},
            "rating": {"$first": "$ricettaInfo.rating"}, "statistiche": {"$first": "$ricettaInfo.statistica"} }}

            ]
        
        , (error, data) => {

            if(error){
                console.log(error)
                return res.json({error: "Errore: qualcosa è andato storto durante la richiesta"})                
            }else{
                console.log(data)
                return res.json(data)
            }

        }
        );
    }
};

module.exports = {
    cercaRicette
};