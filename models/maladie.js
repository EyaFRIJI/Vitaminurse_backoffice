const { Schema, model } = require("mongoose");

const maladieSchema = new Schema({
  name: String,
  ocr: String,
  max: Number,
});

const Maladie = model("maladie", maladieSchema);
module.exports = Maladie;
