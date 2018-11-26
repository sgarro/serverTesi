const express = require("express");
const router = express.Router();
const User = require ("./models/user");

router.post("/registrazione", (req, res)=>{
    let user = new User();
    const{nome, cognome, role, indirizzo, email, password} =req.body
    user.nome = nome;
    user.cognome = cognome;
    user.role = role;
    user.indirizzo = indirizzo;
    user.email = email;
    user.password = password;
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });

  router.get("/login", (req, res)=>{
    const{email, password} = req.query;
    
    User.findOne({ "email": email }, function(err, user) {
        if (err) return res.send(err);
        if(user==null){
            return res.json({success: false, error: 'Utente non trovato'});
        }
        // return res.json({success: true, data: user});
        // test a matching password
       user.comparePassword(password, function(err, isMatch) {
            if (err) return res.send(err);
            if(isMatch) return res.json({success: true, data: user}); // -&gt; Password123: true
            else return res.json({success: false, error: 'Password sbagliata'}); // -&gt; Password123: true
        });
    
       
    });
  })

  module.exports = router;