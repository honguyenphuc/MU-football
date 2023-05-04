const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/ProductController");
const accountController = require("../app/controllers/AccountController");

router.get('/cart', productController.getCart);

router.get('/shipping', accountController.checkPaying, productController.shipping);
router.put('/shipping',accountController.getAccount, accountController.infoUser);
router.get('/shipping/bill', productController.shippingBill);

router.delete('/cart/:id', productController.deleteItem);

router.get('/add/:id', productController.addToCart);

router.get("/:id", productController.product_detail);

router.get(
  "/",
  productController.getHomeProduct,
  productController.getAwayProduct,
  productController.getThirdProduct,
  productController.getTrainingProduct,
  productController.getTicketProduct,
  productController.index
);

module.exports = router;
