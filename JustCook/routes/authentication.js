const express = require('express');
const router = express.Router()
const authenticationsController = require('../controllers/authentication');
const multer = require('multer');
const upload = multer();

/*
    inserisci qui gli endpoint delle funzioni: es
    router.post('/ricetta', ricettaController.<nome funzione>);
*/

router.post('/login', authenticationsController.login);

module.exports = router; // export to use in server.js