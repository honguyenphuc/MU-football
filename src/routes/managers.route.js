const express = require("express");
const router = express.Router();
const multer = require("multer");

const accountController = require("../app/controllers/AccountController");
const managerController = require("../app/controllers/ManagerController");
const cartController = require("../app/controllers/CartController");

//Lưu ảnh cho match
const storageMatch = multer.diskStorage({
  destination: function (req, file, res) {
    res(null, "src/public/img/match/");
  },
  filename: function (req, file, res) {
    res(null, file.originalname);
  },
});
//Khai báo đối tượng multer
const uploadMatch = multer({ storage: storageMatch });

//Định nghĩa nơi lưu trữ file add player
const storage = multer.diskStorage({
  destination: function (req, file, res) {
    res(null, "src/public/img/player/");
  },
  filename: function (req, file, res) {
    res(null, file.originalname);
  },
});
//Khai báo đối tượng multer
const upload = multer({ storage: storage });

//Định nghĩa nơi lưu trữ file add news
const storageNews = multer.diskStorage({
  destination: function (req, file, res) {
    res(null, "src/public/img/news/");
  },
  filename: function (req, file, res) {
    res(null, file.originalname);
  },
});
//Khai báo đối tượng multer
const uploadNews = multer({ storage: storageNews });


//Định nghĩa nơi lưu trữ file add product
const storageProduct = multer.diskStorage({
  destination: function (req, file, res) {
    res(null, "src/public/img/product/");
  },
  filename: function (req, file, res) {
    res(null, file.originalname);
  },
});
//Khai báo đối tượng multer
const uploadProduct = multer({ storage: storageProduct });
router.get(
  "/player-create",
  accountController.checkLogin,
  managerController.player_create
);

router.post(
  "/player-create",
  accountController.checkLogin,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  managerController.player_post
);

router.get(
  "/player/:id/edit",
  accountController.checkLogin,
  managerController.player_edit
);

router.put(
  "/:id",
  accountController.checkLogin,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  managerController.player_update
);

router.delete(
  "/:id",
  accountController.checkLogin,
  managerController.player_delete
);

router.get("/player", accountController.checkLogin, managerController.player);

//[manager/news]
//[GET] /news-create
router.get(
  "/news-create",
  accountController.checkLogin,
  managerController.news_create
);

//[POST]  /news-create
router.post(
  "/news-create",
  accountController.getAccount,
  uploadNews.single("headline_image"),
  managerController.news_post
);

router.get(
  "/news/:id/edit",
  accountController.checkLogin,
  managerController.news_edit
);

router.put(
  "/news/:id",
  accountController.checkLogin,
  uploadNews.single("headline_image"),
  managerController.news_update
);

router.delete(
  "/news/:id",
  accountController.checkLogin,
  managerController.news_delete
);


//[GET] /product-create
router.get(
  "/product-create",
  accountController.checkLogin,
  managerController.product_create
);

//[POST]  /product-create
router.post(
  "/product-create",
  accountController.getAccount,
  uploadProduct.array("productImage"),
  managerController.product_post
);

router.get(
  "/product/:id/edit",
  accountController.checkLogin,
  managerController.product_edit
);

router.put(
  "/product/:id",
  accountController.checkLogin,
  uploadProduct.array("productImages"),
  managerController.product_update
);

router.delete(
  "/product/:id",
  accountController.checkLogin,
  managerController.product_delete
);


router.get('/order', accountController.checkLogin, cartController.getCart, cartController.index);
router.delete('/order/:id', accountController.checkLogin, accountController.getListProduct, accountController.getAvailable, accountController.setAvailable, managerController.cancelProduct, accountController.cancelProduct);
router.post('/order/confirm', accountController.checkLogin, cartController.confirm);

router.get("/news", accountController.checkLogin, managerController.news);
router.get("/product", accountController.checkLogin, managerController.product);
router.get("/match", accountController.checkLogin, managerController.match);
router.get("/match-create", accountController.checkLogin, managerController.match_create);
router.post("/match-create", accountController.checkLogin, uploadMatch.single('logo'), managerController.match_post);
router.get("/match/:id/edit", accountController.checkLogin, managerController.match_edit);
router.put("/match/:id", accountController.checkLogin,uploadMatch.single('logo'), managerController.match_update);
router.delete("/match/:id", accountController.checkLogin, managerController.match_delete);
router.get('/account', accountController.checkLogin, managerController.account);
router.get("/account-create", accountController.checkLogin, managerController.account_create);
router.post("/account-create", accountController.checkLogin, managerController.account_post, managerController.account_add);
router.get("/account/:id/edit", accountController.checkLogin, managerController.account_edit);
router.put("/account/:id", accountController.checkLogin, managerController.account_update);
router.delete("/account/:id", accountController.checkLogin, managerController.account_delete);
router.get("/", accountController.checkLogin, managerController.index);

module.exports = router;
