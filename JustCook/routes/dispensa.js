const express = require('express');
const router = express.Router()
const dispensa = require('../models/dispensa');
const dispensaController = require('../controllers/dispensa');
const multer = require('multer');
const { route } = require('./ingrediente');
const upload = multer();


/*

inserisci qui gli endpoint delle funzioni: es
router.post('/ricetta', ricettaController.<nome funzione>);

*/


router.post('/dispensa',upload.none(), dispensaController.nuovaDispensa);
router.get('/dispensa', dispensaController.getDispensa);
router.patch('/dispensa/:nome', dispensaController.aggiungiIngrediente);

module.exports = router; // export to use in server.js