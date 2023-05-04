const express = require("express");
const router = express.Router();

const newsController = require("../app/controllers/NewsController");

router.get("/:id", newsController.news_detail);
router.get("/", newsController.getCountDocuments, newsController.index);

module.exports = router;
