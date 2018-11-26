const express = require("express");
const router = express.Router();
const Articolo = require("./models/articolo");

router.route('/')
.get((req, res) => {
    Articolo.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
  })
  // this is our update method
// this method overwrites existing data in our database
.put((req, res) => {
    var opts = { runValidators: true };
  
    const { id, update } = req.body;
    // let update = {$inc: {disponibilita: -1}}
  
    var query = { id: id };
    Articolo.findByIdAndUpdate(id, update, opts, err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  })
  // this is our delete method
// this method removes existing data in our database
.delete((req, res) => {
    const { id } = req.body;
    Articolo.findOneAndDelete(id, err => {
      if (err) return res.send(err);
      return res.json({ success: true });
    });
  })
  
  // this is our create methid
  // this method adds new data in our database
  .post((req, res) => {
    let data = new Articolo();
  
    const { id, nome, disponibilita, prezzo, marca, immagine } = req.body;
    
    data.id = id;
    data.nome = nome;
    data.disponibilita = disponibilita;
    data.prezzo = prezzo;
    data.marca = marca;
    data.immagine = immagine;
    data.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  });
  

  module.exports = router;