const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account')

router.patch('/aggiungiAiPreferiti', accountController.aggiungiAiPreferiti);
router.patch('/togliDaiPreferiti', accountController.togliDaiPreferiti);
router.patch('/aggiungiRating', accountController.aggiungiRating);
router.patch('/completaRicetta', accountController.completaRicetta);
router.get('/account/:indirizzoEmail', accountController.getMail);

module.exports = router;
