const Account = require("../models/Account");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");

class AccountController {
  //middleware checks for login
  checkLogin(req, res, next) {
    try {
      var token = req.cookies.account;
      var id_req = jwt.verify(token, "bayga");
      var id = id_req._id;
      Account.findOne({ _id: id })
        .then((account) => {
          if (account.admin) {
            next();
          } else {
            res.json({ message: "Bạn không có quyền truy cập" }); // Render ra trang 404
          }
        })
        .catch((err) => {
          res.json({
            success: false,
            message: "Lỗi server" + err.message,
          });
        });
    } catch (err) {
      res.redirect("../account");
    }
  }

  checkPaying(req, res, next) {
    try {
      var token = req.cookies.account;
        var id_req = jwt.verify(token, "bayga");
        var id = id_req._id;
        Account.findOne({ _id: id })
          .then((account) => {
            req.account = account;
            next();
          })
          .catch((err) => {
            res.json({
              success: false,
              message: "Lỗi server" + err.message,
            });
          });
    } catch (err) {
      res.redirect("../account");
    }
  }

  getAccount(req, res, next) {
    try {
      var token = req.cookies.account;
      var id_req = jwt.verify(token, "bayga");
      var id = id_req._id;
      Account.findOne({ _id: id })
        .then((account) => {
          req.account = account._id;
          next();
        })
        .catch((err) => {
          res.json({
            success: false,
            message: "Lỗi server" + err.message,
          });
        });
    } catch (err) {
      res.redirect("../account");
    }
  }

  getName(req, res, next) {
    Account.findById(req.account)
      .then((account) => {
        req.accountName = account.name;
        next();
      })
      .catch(next);
  }

  // [GET] /login
  index(req, res, next) {
    res.render("account/login");
  }

  // [POST] account/login
  login(req, res, next) {
    const user = req.body;
    const email = user.email;
    const password = user.password;
    Account.findOne({ email: email, password: password })
      .then((account) => {
        if (account) {
          var token = jwt.sign({ _id: account._id }, "bayga");
          return res.json({
            success: true,
            token: token,
            name: account.name,
            admin : account.admin,
            message: "Đăng nhập thành công",
          });
          
        } else {
          res.json({
            success: false,
            message: "Tài khoản hoặc mật khẩu không đúng.",
          });
        }
      })
      .catch(function (err) {
        res.json({
          success: false,
          message: "Lỗi server",
        });
      });
  }

  // [GET] /account/register
  register(req, res, next) {
    res.render("account/register");
  }

  //[POST] /account/register
  store(req, res, next) {
    console.log(req.body);
    const email = req.body.email;
    console.log(email);
    Account.findOne({ email })
      .then((account) => {
        if (account) {
          res.json({ 
            success: false,
            message: "Email already exists." 
          });
        } else {
          next();
        }
      })
      .catch(next);
  }

  checkPhone(req, res, next) {
    const phone = req.body.phone;
    Account.findOne({ phone })
      .then((account) => {
        if (account) {
          res.json({ 
            success: false,
            message: "Phone number already exists" 
          });
        } else {
          next();
        }
      })
      .catch(next);
  }

  account_create(req, res, next) {
    Account.create({email: req.body.email, password: req.body.password, name : req.body.name, phone: req.body.phone, address: req.body.address}, function(err){
      if(err) {
        console.error(err);
      }
      else {
        res.json({success: true});
      }
    })
  }

  infoUser(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const phone = req.body.phone;
    const accountNumber = req.body.inputAccountNumber;
    const accountName = req.body.inputAccountName;
    if(req.account) {
      Account.findByIdAndUpdate(req.account, {name, email, address, phone, accountNumber, accountName}, function (err) {
        if (err) return handleError(err);
        else res.redirect("../product/shipping/bill");
      })
    }
  };

  // [GET] /account/challenge
  challenge(req, res, next) {
    res.render("account/challenge");
  }

  logout(req, res, next) {
    res.clearCookie("account");
    req.session.destroy();
    res.redirect("/account");
  }

  buyHistory(req, res, next) {
    const _id = req.account;
    Cart.find({customer: _id})
      .lean()
      .then(carts => {
          if(carts) {
            let productFirst = [], productSecond = [], productLast = [];
            carts.forEach(cart => {
              cart.product.forEach(product => {
                if(product.status === 0) {
                  product.idCart = cart._id;
                  productFirst.push(product);
                }
                else if(product.status === 1) {
                  product.idCart = cart._id;
                  productSecond.push(product);
                }
                else {
                  product.idCart = cart._id;
                  productLast.push(product);
                }
              })
            })
            res.render("account/buy_history", {
              productFirst,
              productSecond,
              productLast
            });
          }
          else {
            res.render("account/buy_history", {message: "Bạn chưa mua sản phẩm nào!"});
          }
          
      })
      .catch(next);
  }

  setAvailablePost(req, res, next) {
    for(let item of req.session.cart) {
      Product.findByIdAndUpdate({_id: item.id}, {available: item.available - item.quantity}, function(err){
        if(err) {
          console.error(err);
        }
        next();
      })
    }
  }

  postShoppingCart(req, res, next) {
    const _id = req.account;
    const name = req.accountName;
    const cartSession = req.session.cart;
    for(let item of cartSession) {
      item.createTime = Date();
      item.status = 0;
    }
    const cart = new Cart({ customer: _id, customerName: name, product: cartSession});
    cart.save(function(err) {
      if (err) return handleError(err);
      req.session.destroy(function(err) {
      })
      res.redirect('./buy-history');
    });     
  }

  getListProduct(req, res, next) {
    const cartId = req.query.idCart;
    Cart.findById({_id : cartId})
      .lean()
      .then(cart => {
        req.product = cart.product;
        next();
      })
      .catch(next);
  }

  getCanceledProduct(req, res, next) {
    const productId = req.params.id;
    const size = req.query.size;
    req.result = req.product.filter(product => {
      return product.id !== productId || (product.id === productId && product.size !== size);
    })
    next();
  }

  getAvailable(req, res, next) {
    const productId = req.params.id;
    Product.findById({_id : productId})
      .then(product => {
        req.available = product.available;
        next();
      })
      .catch(next);
  }
  
  setAvailable(req, res, next) {
    const productId = req.params.id;
    Product.findByIdAndUpdate({_id : productId}, {available: req.available + +req.query.quantity}, function(err) {
      if(err) {
        console.error(err);
      }
      next();
    })
  }

  cancelProduct(req, res, next) {
    const cartId = req.query.idCart;
    Cart.findByIdAndUpdate({_id : cartId}, {product : req.product}, function(err) {
      if (err) return handleError(err);
        else res.redirect("back");
    })
  }

}

module.exports = new AccountController();
