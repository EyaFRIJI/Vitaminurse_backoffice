const { Router } = require("express");
const Maladie = require("../models/maladie");
const router = Router();

router.get("/", async (request, response) => {
  const maladies = await Maladie.find({ supprime_le: null });
  response.send(maladies);
});

router.post("/", async (request, response) => {
  const { name, ocr, max } = request.body;
  const maladie = new Maladie({ name, ocr, max });
  maladie.save().then((savedMaladie) => {
    response.send(savedMaladie);
  });
});

router.delete("/", async (request, response) => {
  const { id } = request.body;
  const maladie = await Maladie.findById(id);
  if (maladie) {
    maladie.supprime_le = new Date();
    maladie.save().then((savedMaladie) => {
      response.send(savedMaladie);
    });
  } else response.status(404).send("maladie not found");
});

module.exports = router;
