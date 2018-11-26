const express = require("express");
const router = express.Router();
const Ordine = require ("./models/ordine");
const Fattura = require ("./models/fattura");

router.route('/')
.post((req, res)=>{
    let fattura = new Fattura();
    const {idOrdine, articoli, prezzo} = req.body;
    
    if(!idOrdine) 
      return res.json({success: false, error: 'Campo ordine mancante'});
    if(!articoli) 
      return res.json({success: false, error: 'Campo articoli mancante'});
    if(!prezzo) 
      return res.json({success: false, error: 'Campo prezzo mancante'});

    Ordine.findOne({"_id": idOrdine}, (err, data) => {
      if (err) return res.send(err);
      if(data==null){
        return res.json({success: false, error: 'Ordine non trovato'});
      }
      for(var i = 0; i < articoli.length; i++) {
        if(data.articoli.indexOf(articoli[i]._id)==-1) 
          return res.json({ success: false, error: "articolo "+articoli[i]+ " non presente nell'ordine" });
        }
      fattura.idOrdine = idOrdine
      fattura.nome = data.nome
      fattura.indirizzo = data.indirizzo
      fattura.prezzo = prezzo
      fattura.articoli = articoli
      fattura.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
      });
    });
})
.get( (req, res) => {
    Fattura
    .find()
    .populate('articoli')
    .exec(function(err, data) {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: data });
      });
});

module.exports = router;