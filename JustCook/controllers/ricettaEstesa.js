const RicettaEstesa = require("../models/ricettaEstesa");

//GET restituisce ricette con:: nome + autore + rating + statistiche
// NOTA: bisogna ritornare solo le ricette che contengono un sottoinsieme degli ingredienti della dispensa
// ECCEZIONE: sale, acqua, pepe, olio, zucchero

const cercaRicette = (req, res, next) => {
    //in input prende: 2 array di stringhe (per ingredienti e filtri), stringa per nome

    let ingredientiLista; 
    let filtriLista;

    if(req.query.ingredienti == undefined)
        ingredientiLista = []
    else{
        ingredientiLista = req.query.ingredienti.split(',');
        if(!Array.isArray(ingredientiLista))
            ingredientiLista = [ingredientiLista]
    }
    

    if(req.query.filtri == undefined)
        filtriLista = []
    else{
        filtriLista = req.query.filtri.split(',');
        if(!Array.isArray(filtriLista))
            filtriLista = [filtriLista]
    } 

    let nomeRicetta = req.query.nome;
    let ingredientiBasici = ["Sale", "Zucchero", "Acqua", "Olio"];  
    
    if(ingredientiLista.length == 0){
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

        //cerca Ricetta
        RicettaEstesa.aggregate([
            { $lookup: {from: "ingredientis", localField: "ingredienti", foreignField: "_id", as: "ingredientiInfo"}},
            { $match: {$expr: {$setIsSubset: ["$ingredientiInfo.nome", ingredientiLista] }} },
            { $lookup: {from: "ricettas", localField: "ricetta", foreignField: "_id", as: "ricettaInfo"}},
            { $project: {nome: {$first: "$ricettaInfo.nome"}, autore: {$first: "$ricettaInfo.autore"}, statistica: {$first: "$ricettaInfo.statistica"}, 
            filtri: {$first: "$ricettaInfo.filtri"}, rating: {$first: "$ricettaInfo.rating"}} },
            { $match: { $expr: {$setIsSubset: [filtriLista, "$filtri"]}} },
            { $match: { $expr: { $eq: ["$nome", {$ifNull: [nomeRicetta, "$nome"]} ]}}}
        ]

        , (error, data) => {
            if(error){
                console.log(error)
                return res.status(500).json({error: "Errore: qualcosa è andato storto nella ricerca"})
            }else{
                console.log(data)
                return res.status(200).json(data)
            }
        
        }

        )

    }
};


module.exports = {
    cercaRicette
};
