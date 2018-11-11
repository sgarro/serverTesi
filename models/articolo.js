const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ArticoloSchema = new Schema(
  {
    id: Number ,
    nome: String,
    disponibilita: {type: Number, min: 0},
    prezzo: Number
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Articolo", ArticoloSchema);