const express = require("express");
const router = express.Router();

const fixtureController = require("../app/controllers/FixtureController");


router.get(
  "/",
  fixtureController.index,
);

module.exports = router;
