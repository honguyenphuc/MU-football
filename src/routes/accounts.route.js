const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/AccountController");

router.get("/register", accountController.register);
router.post("/register", accountController.store, accountController.checkPhone, accountController.account_create);
router.get('/buy-history',accountController.getAccount, accountController.buyHistory);
router.post('/buy-history',accountController.getAccount, accountController.getName,accountController.setAvailablePost, accountController.postShoppingCart);
router.delete('/buy-history/:id', accountController.getListProduct,accountController.getAvailable, accountController.setAvailable, accountController.getCanceledProduct, accountController.cancelProduct);
//Login
router.get("/challenge", accountController.challenge);
router.post("/", accountController.login); // post login
//Logout
router.get("/logout", accountController.logout);
router.get("/", accountController.index);

module.exports = router;
