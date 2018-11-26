const express = require("express");
const router = express.Router();
const Articolo = require("./models/articolo");
const Ordine = require ("./models/ordine");
// const Fattura = require ("./models/fattura");
// const User = require ("./models/user");


router.route('/')
.get((req, res) => {
    Ordine
    .find()
    .populate('articoli')
    .exec(function(err, data) {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: data });
      });
})
.post((req, res)=>{
    //  createOrdine(req, res);
     const {articoli} = req.body;
     try {
      // Fails because then A would have a negative balance
      transfer(articoli);
    } catch (error) {
      console.log(error); // "Insufficient funds: 1"
    }
  
      
  })






// async function createOrdine (req, res){
//   session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const {nome, indirizzo, prezzo, articoli} = req.body;
//     let ordine = new Ordine()
//     ordine.nome = nome;
//     ordine.indirizzo = indirizzo;
//     ordine.prezzo = prezzo;
//     ordine.articoli = articoli;
    
//     ordine.articoli.forEach(element => {
//     let query = {"_id": element}
//     let update = {$inc: {disponibilita: -1}}
//     const opts = { runValidators: true, session, new: true };
//     Articolo.findOneAndUpdate(query, update, opts, err => {
//           if (err) throw new Error(err);  
//         });
//     });
//     ordine.save(err => {
//       if (err) throw new Error(err);
//     });
    
//   }catch (error) {
//     // If an error occurred, abort the whole transaction and
//     // undo any changes that might have happened
//     await session.abortTransaction();
//     session.endSession();
//     console.log(error)
//     return res.json({success: false, error: error})
//   }
//   await session.commitTransaction()
//     session.endSession();
//     return res.json({ success: true });
// }

// router





async function transfer(articoli) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session, new: true };
    for(var i = 0; i < articoli.length; i++) {
      let update = {$inc: {disponibilita: -1}}

     const A = await Articolo.findOneAndUpdate({"_id": articoli[i]}, update, opts)
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow so calling function sees error
  }
}

module.exports = router;