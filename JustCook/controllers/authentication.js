const express = require('express');
const router = express.Router();
const Account = require('../models/account'); 
const jwt = require('jsonwebtoken');

router.post(async function(req, res) {
    let user = await Account.findOne({name: req.body.username}).exec()
  
    if (!user)                            res.json({success:false,message:'Account inesistente'})
    if (user.password!=req.body.password) res.json({success:false,message:'Password errata'})
  
    var payload = { email: user.email, id: user._id, other_data: encrypted_in_the_token }
    var options = { expiresIn: 86400 } // expires in 24 hours
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  
    res.json({ success: true, message: 'Accesso effettuato',
      token: token, email: user.email, id: user._id, self: "api/v1/" + user._id
    });
  });

  module.exports = router;