const express = require("express");
const app = express();
const port = 2000;
const { connect } = require("mongoose");
const User = require("./models/user");
const T = require("tesseract.js");

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

app.post("/login", async (request, response) => {
  const { email, mot_passe } = request.body;
  const user = await User.findOne({ email });
  if (user) {
    if (user.mot_passe === mot_passe) {
      response.send(user);
    } else {
      response.status(403).send("mot de passe incorrecte");
    }
  } else {
    response.status(404).send("email incorrecte");
  }
});

app.post("/analyse_ocr", async (request, response) => {
  const produit = request.body.produit;
  const text = await T.recognize(produit.images[0], undefined, {});
  response.send(text.data.text);
});

app.put("/user", async (req, res) => {
  const {
    id,
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
  } = req.body;

  const user = await User.findById(id);
  if (user) {
    Object.assign(user, {
      nom,
      prenom,
      poids,
      taille,
      date_naissance,
      maladies,
      allergies,
      email,
      mot_passe: mot_passe != "" ? mot_passe : user.mot_passe,
      tel,
    });
    user
      .save()
      .then((savedUser) => {
        res.send(savedUser);
      })
      .catch((error) => res.status(500).send("error"));
  } else res.status(404).send("not found");
});

app.put("/add_action", async (request, response) => {
  const { id, action } = request.body;
  const user = await User.findById(id);
  if (user) {
    if (action.products.length === 0) {
      response.status(402).send("empty");
    } else {
      user.actions.push(action);
      user.save().then((savedUser) => {
        response.send(savedUser);
      });
    }
  } else response.status(404).send("not found");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
