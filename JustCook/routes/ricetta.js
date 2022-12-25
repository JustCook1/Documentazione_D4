const express = require('express');
const router = express.Router()
const ricettaController = require('../controllers/ricetta');
const multer = require('multer');
const upload = multer();


/*

inserisci qui gli endpoint delle funzioni: es
router.post('/ricetta', ricettaController.<nome funzione>);

*/
router.post('/nuovaRicetta',upload.none(), ricettaController.postNuovaRicetta);
router.get('/ricetta/:nome/:autore', ricettaController.getRicetta);

module.exports = router; // export to use in server.js