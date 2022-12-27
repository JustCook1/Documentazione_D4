const express = require('express');
const router = express.Router()
const accountController = require('../controllers/account');
const ricettaEstesaController = require('../controllers/ricettaEstesa');


router.get('/cercaRicette/:cerca', ricettaEstesaController.cercaRicette);
router.patch('/aggiungiAiPreferiti', accountController.aggiungiAiPreferiti);
router.patch('/togliDaiPreferiti', accountController.togliDaiPreferiti);
router.patch('/aggiungiRating', accountController.aggiungiRating);
router.patch('/completaRicetta', accountController.completaRicetta);


module.exports = router; 