const { Router } = require("express");
const Maladie = require("../models/maladie");
const router = Router();

router.get("/", async (request, response) => {
  const maladies = await Maladie.find();
  response.send(maladies);
});

router.post("/", async (request, response) => {
  const { name, ocr, max } = request.body;
  const maladie = new Maladie({ name, ocr, max });
  maladie.save().then((savedMaladie) => {
    response.send(savedMaladie);
  });
});

module.exports = router;
