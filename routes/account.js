const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account')

router.patch('/aggiungiAiPreferiti', accountController.aggiungiAiPreferiti);
router.patch('/togliDaiPreferiti', accountController.togliDaiPreferiti);
router.patch('/aggiungiRating', accountController.aggiungiRating);
router.get('/infoRatingDati/:param', accountController.ritornaRatingDatoRicetta);
router.patch('/completaRicetta', accountController.completaRicetta);
router.get('/account/:indirizzoEmail', accountController.getMail);
router.patch('/account/:params', accountController.patchPassword);

module.exports = router;
