const { Schema, model } = require("mongoose");

const allergieSchema = new Schema({
  nom: String,
});

const Allergie = model("allergie", allergieSchema);
module.exports = Allergie;
