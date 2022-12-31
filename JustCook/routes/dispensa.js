const express = require('express');
const router = express.Router()
const dispensaController = require('../controllers/dispensa');
const multer = require('multer');
const upload = multer();

/*

inserisci qui gli endpoint delle funzioni: es
router.post('/ricetta', ricettaController.<nome funzione>);

*/

router.post('/dispensa',upload.none(), dispensaController.nuovaDispensa);
router.get('/dispensa/:nome', dispensaController.getDispensa);

//non so se devo aggiungere l'id dell'account o se lo prende da solo
router.patch('/dispensa/aggiungiIngrediente', dispensaController.aggiungiIngrediente);
router.patch('/dispensa/modificaquantita', dispensaController.modificaQuantita);
router.delete('/dispensa/eliminaIngrediente', dispensaController.eliminaIngrediente);

module.exports = router; // export to use in server.js