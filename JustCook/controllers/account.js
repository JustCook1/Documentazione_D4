const Account = require('../models/account');
const Ricetta = require('../models/ricetta');
const mongoose = require('mongoose');

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
    aggiungiRating
};