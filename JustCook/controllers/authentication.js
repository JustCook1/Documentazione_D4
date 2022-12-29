const express = require('express');
const router = express.Router();
const Account = require('../models/account'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/controllers/authentications',async function(req, res) {
    console.log("POST /authentication");
    let user = await Account.findOne({username: req.body.username}).exec()
  
    if (!user)                         res.json({success:false,message:'Account inesistente'})
    if (user.password!=req.body.password)  res.json({success:false,message:'Password errata'})

    //GB: qui tolgo other_data e metto solo email e id visto che sennò da errore
    var payload = { email: user.indirizzoEmail, id: user._id}
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  
    res.json({ success: true, message: 'Accesso effettuato',
      token: token, email: user.indirizzoEmail, id: user._id, self: "api/v1/" + user._id
    });
  });

 

  module.exports = router;