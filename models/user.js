const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  nom: String,
  prenom: String,
  poids: Number,
  taille: Number,
  date_naissance: Date,
  maladies: [{ type: Types.ObjectId, ref: "maladie" }],
  allergies: [{ type: Types.ObjectId, ref: "allergie" }],
  cree_le: { type: Date, default: Date.now },
  supprime_le: { type: Date, default: null },
  actions: Array,
  email: String,
  mot_passe: String,
  tel: String,
});

const User = model("users", userSchema);

module.exports = User;
