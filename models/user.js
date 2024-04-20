const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  nom: String,
  prenom: String,
  poids: Number,
  taille: Number,
  date_naissance: Date,
  maladies: Array,
  allergies: Array,
  cree_le: { type: Date, default: Date.now },
  supprime_le: { type: Date, default: null },
  actions: Array,
  email: String,
  mot_passe: String,
  tel: String,
});

const User = model("users", userSchema);

module.exports = User;
