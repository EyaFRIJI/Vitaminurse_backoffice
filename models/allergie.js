const { Schema, model } = require("mongoose");

const allergieSchema = new Schema({
  name: String,
  supprime_le: { type: Date, default: null },
});

const Allergie = model("allergie", allergieSchema);
module.exports = Allergie;
