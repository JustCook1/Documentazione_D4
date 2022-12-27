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
    
    console.log("ingredienti")
    console.log(ingredientiLista)
    console.log("filtri")
    console.log(filtriLista)
    console.log("ricetta")
    console.log(nomeRicetta)
    
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
                return res.status(200).json(data)
            }
        
        }

        )

    }
};

const aggiungiAiPreferiti = (req, res) => {
    
    let nomeRicetta = req.body.ricetta;
    let autoreRicetta = req.body.autore;
    let nomeAccount = req.body.account;

    //trova ricetta corrispondente
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, {"_id": true}
    , (error, data) => {

        if(error){
            console.log(error)
            return res.status(500).json({error: "Errore: qualcosa è andato storto nell'aggiugere la ricetta"})                
        }else{
            if(data == null){
                return  res.status(404).json({error: "Errore: ricetta da aggiungere non presente nel database"})
                
            }else{
                let id_ricetta = mongoose.Types.ObjectId(data._id)
                console.log("ID RICETTA: " + id_ricetta)

                //controlla che la ricetta non sia già tra i preferiti::
                Account.findOne( { username: nomeAccount, preferiti: id_ricetta } 
                , (error, data) => {
                    if(error){
                        console.log(error)
                        return res.status(500).json({error: "Errore: qualcosa è andato storto nell'aggiugere la ricetta"})                
                    }else{
                        if(data == null){

                            Account.updateOne( { "username": nomeAccount}, 
                            { $push: {"preferiti": id_ricetta } }
                            , (error) => {
                                if(error){
                                    console.log(error)
                                    return res.status(404).json({error: "Errore: account indicato non trovato"})                
                                }else{
                                    return res.status(200).json({message: "Ok: ricetta aggiunta ai preferiti"})
                                }
                    
                            }
                            );

                        }else
                            return res.status(400).json({error: "Errore: ricetta già presente nei preferiti"})
                    }
        
                }

                );
            }
                 
        }

    }
    );

    
    
};


const completaRicetta = (req, res) => {
    
    let nomeRicetta = req.body.ricetta;
    let autoreRicetta = req.body.autore;
    let nomeAccount = req.body.account;

    //controlla che la ricetta esista
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, {"_id": true} 
    , (error, data) => {

        if(error){
            console.log(error)
            return res.status(500).json({error: "Errore: qualcosa è andato storto nela fase di completamento della ricetta"})                
        }else{
            if(data == null)
                return  res.status(404).json({error: "Errore: ricetta da aggiungere non presente nel database"})
            else{
                //la ricetta è presente nel db
                let id_ricetta = mongoose.Types.ObjectId(data._id)

                //controlla se nell'account è già presente la ricetta da completare
                Account.findOne({username: nomeAccount,  "primiCompletamenti":  id_ricetta}
                , (error, data) => {

                    if(error){
                        console.log(error)
                        return res.status(500).json({error: "Errore: qualcosa è andato storto nela fase di completamento della ricetta"})                
                    }else{
                        if(data == null){
                            // non è mai stata completata
                            //ricerca l'id della ricetta
                            Account.updateOne( { "username": nomeAccount},
                                { $push: {"primiCompletamenti": id_ricetta } }

                            , (error) => {
                                if(error){
                                    console.log(error)
                                    return res.status(500).json({error: "Errore: qualcosa è andato storto nela fase di completamento della ricetta"})
                                }else{
                                    return res.status(200).json({message: "Ok: ricetta completata"})
                                }
                                
                            }
                            );
                        }else{
                            return res.json({error: "Errore: la ricetta è già stata completata"});
                        }
                    }
                });
            }
        } 
    }
    );
};

//DA ESEGUIRE SOL SE PREFAVORITI = TRUE
//TODO DA IMPLEMENTARE IL CHECK NELLO SCRIPT
const togliDaiPreferiti = (req, res) => {
    
    let nomeRicetta = req.body.ricetta;
    let autoreRicetta = req.body.autore;
    let nomeAccount = req.body.account;

    //trova ricetta corrispondente
    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}, {"_id": true}
    , (error, data) => {

        if(error){
            console.log(error)
            return res.status(500).json({error: "Errore: qualcosa è andato storto nell'eliminazione della ricetta"})                
        }else{
            console.log(data)
            if(data == null){
                return  res.status(404).json({error: "Errore: ricetta da togliere non presente nel database"})
            }else{
                let id = mongoose.Types.ObjectId(data._id)
                Account.updateOne( { "username": nomeAccount}, { $pull: {"preferiti": id} }
                , (error, dataAcc) => {
                    console.log(dataAcc)
                    if(error){
                        console.log(error)
                        return res.status(500).json({error: "Errore:  qualcosa è andato storto nell' eliminazione della ricetta"})                
                    }else{
                        return res.status(200).json({message: "Ok: ricetta tolta dai preferiti"})
                    }
        
                }
                );
            }
        }

    }
    );
};

const aggiungiRating = (req, res) => {
    let nomeRicetta = req.body.ricetta;
    let autoreRicetta = req.body.autore;
    let nomeAccount = req.body.account;
    let rating = req.body.rating;

    if(rating < 0 || rating > 5 || rating == undefined) 
        return res.status(400).json({error: "Errore: rating non valido"});
    else{
        //controlla se la ricetta effettivamente esiste
        Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}
            , (error, data) => {
                if(error){
                    return res.status(500).json({error: "Errore: qualcosa è andato storto nell'aggiungere il nuovo rating"})         
                }else{
                    if(data == null){
                        //non esiste la ricetta nel db
                        return res.status(404).json({error: "Errore: la ricetta inserita non esiste nel database"})

                    }else{
                        //esiste nel db, allora guarda se l'account ha già dato un rating a questa
                        let id_ricetta = mongoose.Types.ObjectId(data._id)
                        console.log(data)
                        Account.findOne({username: nomeAccount, "ratingDati.ricetta": id_ricetta }
                            // trova account
                        , (error, data) => {
                            if(error){
                                return res.status(500).json({error: "Errore: qualcosa è andato storto nell'aggiungere il nuovo rating"})         
                            }else{
                                if(data == null){
                                    Account.updateOne( { "username": nomeAccount}, { $push: {"ratingDati": {ricetta: id_ricetta, ratingDato: rating} } }
                                        , (error, dataAcc) => {
                                            console.log(dataAcc)
                                            if(error){
                                                console.log(error)
                                                return res.status(500).json({error: "Errore: qualcosa è andato storto nell'aggiunta del nuovo rating"})                
                                            }else{
                                                return res.status(200).json({message: "Ok: nuovo rating aggiunto"})
                                            }
                                
                                        }
                                    );
                                }else
                                    return res.status(400).json({error: "Errore: rating già registrato per questa ricetta"})
                            }
                        }
                        );
                    }
                
                
                }
            }
        );

    }
};


module.exports = {
    aggiungiAiPreferiti,
    completaRicetta,
    togliDaiPreferiti,
    aggiungiRating,
    cercaRicette
};
