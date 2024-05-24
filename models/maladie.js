const { Schema, model } = require("mongoose");

const maladieSchema = new Schema({
  nom: String,
});

const Maladie = model("maladie", maladieSchema);
module.exports = Maladie;
