const { Schema, model } = require("mongoose");

const maladieSchema = new Schema({
  name: String,
  ocr: String,
  max: Number,
  supprime_le: { type: Date, default: null },
});

const Maladie = model("maladie", maladieSchema);
module.exports = Maladie;
