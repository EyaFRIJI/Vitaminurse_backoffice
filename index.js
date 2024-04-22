const express = require("express");
const app = express();
const port = 2000;
const { connect } = require("mongoose");
const User = require("./models/user");

app.use(express.json());

connect("mongodb://127.0.0.1:27017/VitamiNurseDB")
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.post("/register", (request, response) => {
  const {
    nom,
    prenom,
    poids,
    taille,
    date_naissance,
    maladies,
    allergies,
    email,
    mot_passe,
    tel,
  } = request.body;
  const user = new User({
    nom,
    prenom,
    poids,
    taille,
    date_naissance,
    maladies,
    allergies,
    email,
    mot_passe,
    tel,
  });

  user
    .save()
    .then((savedUser) => {
      response.send(savedUser); //par défaut 200
    })
    .catch((error) => {
      response.status(500).send({ errorMessage: error.message });
    });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
