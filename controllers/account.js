const Account = require('../models/account');
const Ricetta = require('../models/ricetta');
const RicettaEstesa = require('../models/ricettaEstesa');
const Dispensa = require('../models/dispensa');
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
    RicettaEstesa.aggregate([
        { $lookup: {from: "ricettas", localField: "ricetta", foreignField: "_id", as: "ricettaInfo"}},
        { $project: {nome: "$ricettaInfo.nome", autore: "$ricettaInfo.autore", ingredienti: "$ingredienti", quantita: "$quantita", 
            "_id": { $first: "$ricettaInfo._id"} }},
        { $match: {nome: nomeRicetta,autore: autoreRicetta} }
    ], (error, dataRicetta) => {
        if(error){
            console.log(error)
            return res.status(500).json({error: "Errore: qualcosa è andato storto nela fase di completamento della ricetta"})                
        }else{
            if(dataRicetta.length == 0)
                return  res.status(404).json({error: "Errore: ricetta da completare non presente nel database"})
            else{
                //la ricetta è presente nel db
                dataRicetta = dataRicetta[0]
                let id_ricetta = mongoose.Types.ObjectId(dataRicetta._id)

                //controlla se nell'account è già presente la ricetta da completare
                Account.aggregate([
                    { $match: {username: nomeAccount}},
                    { $lookup: {from: "dispensas", localField: "_id", foreignField: "account", as: "dispensaInfo"}}, //join con dispensa
                    { $project: {ingredientiDispensa: {$first:"$dispensaInfo.ingredienti"}, quantitaDispensa: {$first:"$dispensaInfo.quantita"}, id_account: "$_id",
                        completata: {$in: [id_ricetta, "$primiCompletamenti"] }  }}
                ]
                , (error, dataDisp) => {
                    //ritorna qualcosa solo se in primiCompletamenti non c'è la ricetta cercata

                    if(error){
                        console.log(error)
                        return res.status(500).json({error: "Errore: qualcosa è andato storto nela fase di completamento della ricetta"})                
                    }else{
                        dataDisp = dataDisp[0]

                        //togli gli ingredienti::
                        //1.controlla che nella dispensa dell'account ci siano ingredienti a sufficienza
                        //1.1 bisogna prima cercare se esiste nella dispensa ogni ingrediente della ricetta
                        //1.2 bisogna controllare se la quantità è sufficiente
                        let ingredientiSufficienti = true
                        let nuoveQuantita = dataDisp.quantitaDispensa
                        let nuoviIngredienti = dataDisp.ingredientiDispensa // se si raggiunge lo 0 si rimuove l'ingrediente
                        console.log(dataRicetta.ingredienti)

                        for(let k = 0; ingredientiSufficienti && k < dataRicetta.ingredienti.length; k++){
                            let continua = true
                            let j = 0
                            for(j = 0; continua && j < dataDisp.ingredientiDispensa.length; j++){
                                if(""+dataDisp.ingredientiDispensa[j] == ""+dataRicetta.ingredienti[k])
                                    continua = false
                            }
                            j--
                            
                            if(continua){
                                //ingrediente non è dispensa
                                ingredientiSufficienti = false
                            }else{
                                //controlla la quantità
                                if(dataDisp.quantitaDispensa[j] < dataRicetta.quantita[k])
                                    ingredientiSufficienti = false;
                                else{
                                    //aggiorna le quantità
                                    nuoveQuantita[j] = dataDisp.quantitaDispensa[j] - dataRicetta.quantita[k]
                                    if(nuoveQuantita[j] == 0){
                                        nuoveQuantita.splice(j, 1)
                                        nuoviIngredienti.splice(j, 1)
                                    }
                                }
                            }
                        }

                        if(ingredientiSufficienti){
                            //update alla dispensa
                            Dispensa.updateOne( { "account": dataDisp.id_account},
                                { $set: {"ingredienti":  nuoviIngredienti,"quantita": nuoveQuantita} }
                            , (error, data) => {
                                if(error){
                                    console.log(error)
                                    return res.status(500).json({error: "Errore: qualcosa è andato storto nell'update della dispensa"})
                                }else{
                                    if(dataDisp.completata)
                                        return res.json({message: "OK: ricetta completata di nuovo"})
                                    else{
                                        //update all'account
                                        Account.updateOne( { "username": nomeAccount},
                                            { $push: {"primiCompletamenti": id_ricetta }}

                                        , (error) => {
                                            if(error){
                                                console.log(error)
                                                return res.status(500).json({error: "Errore: qualcosa è andato storto nella fase di completamento della ricetta"})
                                            }else{
                                                return res.status(200).json({messaggio: "Ok: ricetta completata per per la prima volta"})
                                            }
                                        });
                                    }
                                }

                            });                          

                        }else
                            return res.json({error: "Errore: non hai gli ingredienti sufficienti per completare la ricetta"});

                        
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

const ritornaRatingDatoRicetta = (req, res) => {
    let nomeRicetta = req.query.ricetta;
    let autoreRicetta = req.query.autore;
    let nomeAccount = req.query.account;

    Ricetta.findOne({nome: nomeRicetta, autore: autoreRicetta}
        , (error, data) => {
            if(error){
                return res.status(200).json(1)
            }else{
                let id_ricetta = mongoose.Types.ObjectId(data._id)
                Account.findOne({username: nomeAccount, "ratingDati.ricetta": id_ricetta}
                ,(error, data) =>{
                    if(error || data == null)
                        return res.status(200).json(-1)
                    else{
                        let ratingRis, continua = true
                        let i
                        for(i = 0; i < data.ratingDati.length && continua; i++){
                            if(""+data.ratingDati[i].ricetta == ""+id_ricetta){
                                continua = false
                                ratingRis = data.ratingDati[i].ratingDato
                            }
                        }

                        return res.status(200).json(ratingRis)
                    }
                }
                );
            }
        }

    );
};

//GET indirizzo email per cambio password
const getMail = (req, res) => {
    let mail = req.params.indirizzoEmail;
    if(!mail) return res.json({error:"Email non inserita", code:404});
    Account.findOne({indirizzoEmail: mail}, (err, Account) =>{
        if (!Account|| err) return res.json({error: "Email non valida", code: 400});
         return res.json(Account.indirizzoEmail);

    });
  
};

//PATCH cambio password

const patchPassword = (req, res) => {

    let mail = req.params.indirizzoEmail;
    let password = req.params.password;

    if(!password) return res.json({error: "Password nuova non inserita", code: 404});

    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    
    if (!strongRegex.test(password)) return res.json({error: "Nuova password non valida", code: 400});

    Account.findOne({indirizzoEmail: mail}, (err, Account) =>{
        if (err) return res.json({error: "Operazione non riuscita", code: 400});
        Account.password = password;
        Account.save((err, data) => {
            if (err) return res.json({error: "Operazione non riuscita", code: 400});
            res.json(data);
  
       });
   });
};

module.exports = {
    aggiungiAiPreferiti,
    completaRicetta,
    togliDaiPreferiti,
    aggiungiRating,
    ritornaRatingDatoRicetta,
    getMail,
    patchPassword
};
