const { Router } = require("express");
const Allergie = require("../models/allergie");
const router = Router();

router.get("/", async (request, response) => {
  const allergies = await Allergie.find({ supprime_le: null });
  response.send(allergies);
});

router.post("/", async (request, response) => {
  const { name } = request.body;
  const allergie = new Allergie({ name });
  allergie.save().then((savedAllergie) => {
    response.send(savedAllergie);
  });
});

router.delete("/", async (request, response) => {
  const { id } = request.body;
  const allergie = await Allergie.findById(id);
  if (allergie) {
    allergie.supprime_le = new Date();
    allergie.save().then((savedAllergie) => {
      response.send(savedAllergie);
    });
  } else response.status(404).send("allergie not found");
});

module.exports = router;
