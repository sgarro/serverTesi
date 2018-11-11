const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Articolo = require("./models/articolo");
const Ordine = require ("./models/ordine");
const Fattura = require ("./models/fattura");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://gestionale:Unibo!123@ds159293.mlab.com:59293/tesi_gestionale";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Articolo.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});
router.get("/getOrdini", (req, res) => {
    Ordine
    .find()
    .populate('articoli')
    .exec(function(err, data) {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: data });
      });
});
router.get("/getFatture", (req, res) => {
    Fattura
    .find()
    .populate('articoli')
    .exec(function(err, data) {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: data });
      });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateMagazzino", (req, res) => {
  const { id, update } = req.body;
  var query = { id: id };
  Articolo.findOneAndUpdate(query, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


// this is our delete method
// this method removes existing data in our database
router.delete("/deleteMagazzino", (req, res) => {
  const { id } = req.body;
  Articolo.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/fillMagazino", (req, res) => {
  let data = new Articolo();

  const { id, nome, disponibilita } = req.body;
  
  data.id = id;
  data.nome = nome;
  data.disponibilita = disponibilita;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});



router.post("/createOrdine", (req, res)=>{
    let ordine = new Ordine();
    const {nome, indirizzo, prezzo, articoli} = req.body;
    ordine.nome = nome;
    ordine.indirizzo = indirizzo;
    ordine.prezzo = prezzo;
    ordine.articoli = articoli;
    ordine.articoli.forEach(element => {
        Articolo.findOneAndUpdate({"_id": element}, {$inc: {disponibilita: -1}}, err => {
            if (err) return res.json({ success: false, error: err });
            return  ordine.save(err => {
                if (err) return res.json({ success: false, error: err });
                
                return res.json({ success: true });
                
              });
          });
    });
   
})
router.post("/createFattura", (req, res)=>{
    let fattura = new Fattura();
    const {id_ordine, articoli, prezzo} = req.body;
    Ordine.findOne({"_id": id_ordine}, (err, data) => {
      if (err) return res.send(err);
      for(var i = 0; i < articoli.length; i++) {
        if(data.articoli.indexOf(articoli[i])==-1) 
          return res.json({ success: false, error: "articolo "+articoli[i]+ " non presente nell'ordine" });
        }
      fattura.idOrdine = id_ordine
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


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));