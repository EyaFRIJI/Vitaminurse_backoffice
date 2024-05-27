const { Router } = require("express");
const Allergie = require("../models/allergie");
const router = Router();

router.get("/", async (request, response) => {
  const allergies = await Allergie.find();
  response.send(allergies);
});

router.post("/", async (request, response) => {
  const { name } = request.body;
  const allergie = new Allergie({ name });
  allergie.save().then((savedAllergie) => {
    response.send(savedAllergie);
  });
});

module.exports = router;
