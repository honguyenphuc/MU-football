const express = require("express");
const router = express.Router();

const playerController = require("../app/controllers/PlayerController");

router.get("/:id", playerController.player_detail);

router.get(
  "/",
  playerController.getGK,
  playerController.getDF,
  playerController.getMF,
  playerController.getFW,
  playerController.index
);

module.exports = router;
