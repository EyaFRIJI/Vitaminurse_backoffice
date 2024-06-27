const express = require("express");
const cors = require("cors");
const app = express();
const port = 2000;
const { connect } = require("mongoose");
const User = require("./models/user");
const T = require("tesseract.js");
const maladieRouter = require("./routes/maladie");
const allergieRouter = require("./routes/allergie");

app.use(express.json());
app.use(cors());

connect("mongodb://127.0.0.1:27017/VitamiNurseDB")
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.use("/maladie", maladieRouter);
app.use("/allergie", allergieRouter);

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
    .then(async (savedUser) => {
      try {
        const u = await User.populate(savedUser, [
          { path: "maladies" },
          { path: "allergies" },
        ]);
        response.send(u);
      } catch (error) {
        console.log(error);
        response.send({});
      }
    })
    .catch((error) => {
      response.status(500).send({ errorMessage: error.message });
    });
});

app.post("/login", async (request, response) => {
  const { email, mot_passe } = request.body;
  const user = await User.findOne({ email })
    .populate("maladies")
    .populate("allergies");
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

app.post("/adminlogin", async (request, response) => {
  const { email, mot_passe } = request.body;
  const user = await User.findOne({ email })
    .populate("maladies")
    .populate("allergies");
  if (user) {
    if (user.mot_passe === mot_passe && user.role === "admin") {
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

app.get("/user", async (req, res) => {
  const users = await User.find({ supprime_le: null });
  res.send(users);
});

app.delete("/user", async (request, response) => {
  const { id } = request.body;
  const user = await User.findById(id);
  if (user) {
    user.supprime_le = new Date();
    user.save().then((savedUser) => {
      response.send(savedUser);
    });
  } else response.status(404).send("user not found");
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
      .then(async (savedUser) => {
        try {
          const u = await User.populate(savedUser, [
            { path: "maladies" },
            { path: "allergies" },
          ]);
          res.send(u);
        } catch (error) {
          console.log(error);
          res.send({});
        }
      })
      .catch((error) => res.status(500).send("error"));
  } else res.status(404).send("not found");
});

app.put("/add_action", async (request, response) => {
  const { id, action } = request.body;
  const user = await User.findById(id)
    .populate("maladies")
    .populate("allergies");
  if (user) {
    if (action.products.length === 0) {
      response.status(402).send("empty");
    } else {
      user.actions.push(action);
      user.save().then(async (savedUser) => {
        try {
          const u = await User.populate(savedUser, [
            { path: "maladies" },
            { path: "allergies" },
          ]);
          response.send(u);
        } catch (error) {
          console.log(error);
          response.send({});
        }
      });
    }
  } else response.status(404).send("not found");
});

app.post("/check_product_compatibility", async (request, response) => {
  const { product, user } = request.body;
  // allergie
  var allergiesAdvices = [];
  var maladiesAdvices = [];
  const check_allergie = await product.allergens.map((allergie) => {
    if (
      user.allergies.find((ua) => {
        return ua.name === allergie;
      }) != null
    ) {
      allergiesAdvices.push({
        message: `Fais attention tu as allergie du " ${allergie} " et ce produit contient le " ${allergie} "`,
      });
      return true;
    } else return false;
  });
  const poids = product.packaging;

  const check_maladies = await user.maladies.map((um) => {
    if (product.ocr[um.ocr] == undefined) return false;
    else {
      const dose = parseFloat(product.ocr[user.maladies[0].ocr].split("/")[0]);
      const echelle = parseFloat(
        product.ocr[user.maladies[0].ocr].split("/")[1]
      );
      const value = (poids / echelle) * dose;

      if (value > um.max) {
        maladiesAdvices.push({
          message: `Fais attention tu as la maladie " ${um.name} " et la quantité de " ${um.ocr} " est élevé `,
        });
        return true;
      } else return false;
    }
  });

  response.send({
    allergies: !check_allergie.includes(true),
    allergiesAdvices,
    maladies: !check_maladies.includes(true),
    maladiesAdvices,
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
