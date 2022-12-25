const express = require('express');
const router = express.Router()
const ingrediente = require('../models/ingrediente');
const ingredienteController = require('../controllers/ingrediente');
const multer = require('multer');
const upload = multer();


/*

inserisci qui gli endpoint delle funzioni: es
router.post('/ricetta', ricettaController.<nome funzione>);

*/

//queste funzioni servono solo per popolare il db e testare le funzioni su postman
router.post('/ingrediente',upload.none(), ingredienteController.postNuovoIngrediente);
router.get('/ingrediente/:nome', ingredienteController.cercaIngrediente);
router.delete('/ingrediente/:nome', ingredienteController.eliminaIngrediente);

module.exports = router; // export to use in server.js