const express = require('express');
const router = express.Router()
const ricetta = require('../models/ricetta');
const ricettaController = require('../controllers/ricetta');
const multer = require('multer');
const upload = multer();


/*

inserisci qui gli endpoint delle funzioni: es
router.post('/ricetta', ricettaController.<nome funzione>);

*/
router.post('/nuovaRicetta',upload.none(), ricettaController.postNuovaRicetta);
router.get('/ricetta/:nome/:autore', ricettaController.getRicetta);
router.patch('/ricetta/aggiungiAiPreferiti/:nome/:autore/:salvata',upload.none(), ricettaController.aggiungiAiPreferiti);
router.patch('/ricetta/completaRicetta/:nome/:autore/:primoCompletamento',upload.none(), ricettaController.completaRicetta);
router.patch('/ricetta/togliDaiPreferiti/:nome/:autore/:salvata',upload.none(), ricettaController.togliDaiPreferiti);
router.patch('/ricetta/aggiungiRating/:nome/:autore/:rating',upload.none(), ricettaController.aggiungiRating);

module.exports = router; // export to use in server.js