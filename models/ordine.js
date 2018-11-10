const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const OrdineSchema = new Schema(
  {
    idOrdine: Number ,
    nome: String,
    indirizzo: String,
    prezzo: Number,
    articoli: [{ type: Schema.Types.ObjectId, ref: 'Articolo', required: true }],
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Ordine", OrdineSchema);