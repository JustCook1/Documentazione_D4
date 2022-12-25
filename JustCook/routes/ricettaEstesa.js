const express = require('express');
const router = express.Router()
const ricettaEstesaController = require('../controllers/ricettaEstesa');


router.get('/cercaRicette', ricettaEstesaController.cercaRicette);

module.exports = router; 