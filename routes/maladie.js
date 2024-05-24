const { Router } = require("express");
const Maladie = require("../models/maladie");
const router = Router();

router.get("/", async (request, response) => {
  const maladies = await Maladie.find();
  response.send(maladies);
});

router.post("/", async (request, response) => {
  const { nom } = request.body;
  const maladie = new Maladie({ nom });
  maladie.save().then((savedMaladie) => {
    response.send(savedMaladie);
  });
});

module.exports = router;
