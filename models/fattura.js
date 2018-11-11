const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const FatturaSchema = new Schema(
  {
    idOrdine: { type: Schema.Types.ObjectId, ref: 'Ordine', required: true } ,
    nome: String,
    indirizzo: String,
    prezzo: Number,
    articoli: [{ type: Schema.Types.ObjectId, ref: 'Articolo', required: true }],
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Fattura", FatturaSchema);