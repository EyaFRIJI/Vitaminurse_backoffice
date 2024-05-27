const { Schema, model } = require("mongoose");

const allergieSchema = new Schema({
  name: String,
});

const Allergie = model("allergie", allergieSchema);
module.exports = Allergie;
