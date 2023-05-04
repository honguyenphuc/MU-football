const Product = require("../models/Product");

class ProductController {
  //[GET] player
  getHomeProduct(req, res, next) {
    Product.find({type: "home"}).lean()
    .then((products) => {
      req.homeProduct = products;
      next();
    })
    .catch(next);
  }

  getAwayProduct(req, res, next) {
    Product.find({type: "away"}).lean()
    .then((products) => {
      req.awayProduct = products;
      next();
    })
    .catch(next);
  }


  getThirdProduct(req, res, next) {
    Product.find({type: "third"}).lean()
    .then((products) => {
      req.thirdProduct = products;
      next();
    })
    .catch(next);
  }


  getTrainingProduct(req, res, next) {
    Product.find({type: "training"}).lean()
    .then((products) => {
      req.trainingProduct = products;
      next();
    })
    .catch(next);
  }

  getTicketProduct(req, res, next) {
    Product.find({type: "ticket"}).lean()
    .then((products) => {
      req.ticketProduct = products;
      next();
    })
    .catch(next);
  }


  index(req, res, next) {
    res.render('product/product', {
      homeProduct: req.homeProduct,
      awayProduct: req.awayProduct,
      thirdProduct: req.thirdProduct,
      trainingProduct : req.trainingProduct,
      ticketProduct : req.ticketProduct,
    })
  }

  product_detail(req, res, next) {
    var _id = req.params.id;
    Product.findById(_id)
      .lean()
      .then((product) => {
        res.render("product/product_detail", {
          product,
        });
      })
      .catch(next);
  }

  getCart(req, res, next) {
    res.render('product/cart', {
      cart: req.session.cart,
    });
  } 

  addToCart(req, res, next) {
    const _id = req.params.id;
    let quantity = req.query.quantity ? req.query.quantity : 1;
    let size = req.query.size ? req.query.size.toUpperCase() : 'S';
    Product.findById(_id, function (err, product) {
      if (err) {
        console.error(err);
      };
      if(typeof req.session.cart === 'undefined') {
        req.session.cart = [];
        if(product.type === 'ticket' && size == 'S') {
            size = 'NORMAL';
        }
        req.session.cart.push({
          id : _id,
          name: product.name,
          image: product.productImage,
          description: product.description,
          price: product.price,
          size: size,
          quantity: parseInt(quantity),
          available: product.available,
        })
      }
      else {
        let newItem = true;
        for (let i = 0; i < req.session.cart.length; i++) {
          if(req.session.cart[i].id === _id && req.session.cart[i].size == size) {
            req.session.cart[i].quantity += parseInt(quantity);
            newItem = false;
          }
        }
        if(newItem) {
          if(product.type === 'ticket' && size == 'S') {
            size = 'NORMAL';
          }
          req.session.cart.push({
            id : _id,
            name: product.name,
            image: product.productImage,
            description: product.description,
            price: product.price,
            size: size,
            quantity: parseInt(quantity),
            available : product.available,
          })
        }
      }
      res.redirect('../cart');
    })
  }

  deleteItem(req, res, next) {
    const _id = req.params.id;
    const size = req.query.size;
    req.session.cart = req.session.cart.filter(item => item.id !== _id || (item.id === _id && item.size !== size));
    res.redirect('back');
  }

  shipping(req, res, next) {
    const account = req.account;
    res.render('product/shipping', {
      name : account.name,
      email: account.email,
      address: account.address,
      phone: account.phone,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
    });
  }

  shippingBill(req, res, next) {
    let cartItem = req.session.cart.map(function (item) {
      return item;
    });
    cartItem.forEach(function(item) {
      item.total = item.price * item.quantity;
      item.size = item.size.toUpperCase();
    })
    res.render('product/bill', {
      cart : req.session.cart,
    })
  }
}

module.exports = new ProductController();
