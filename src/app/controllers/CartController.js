const Cart = require("../models/Cart");
const Account = require("../models/Account");

class CartController {

    getCart(req, res, next) {
        Cart.find({})
            .lean()
            .then(cartItems => {
                //CartItems is all CartDB
                let result = [];
                let resultAll = [];
                //Danh sách mua hàng của các customer
                for(let cartItem of cartItems) {
                    //Danh sach don hang
                    let buyList = {
                        product: [],
                    };
                    let allList = {
                        product: [],
                    }
                    //Danh sach cho
                    buyList.customerName = cartItem.customerName;
                    buyList.idCart = cartItem._id;
                    buyList.customer = cartItem.customer;
                    //Danh sach all
                    allList.customerName = cartItem.customerName;
                    allList.idCart = cartItem._id;
                    allList.customer = cartItem.customer;
                    for(let product of cartItem.product) {
                        //Product cua 1 customer
                        if(product.status == 0) {
                            buyList.product.push(product);
                        }
                        else {
                            allList.product.push(product);
                        }
                    };
                    result.push(buyList);
                    resultAll.push(allList);
                };
                req.cart = result;
                req.allListCart = resultAll;
                next();
            })
            .catch(next);
    };

    index(req, res, next) {
        let result = [];
        let resultAll = [];
        for(let itemCustomer of req.cart) {
            for(let product of itemCustomer.product) {
                product.productCustomer = itemCustomer.customerName;
                product.productCustomerId = itemCustomer.customer;
                product.idCart = itemCustomer.idCart;
                result.push(product);
            }
        }

        for(let itemCustomer of req.allListCart) {
            for(let product of itemCustomer.product) {
                product.productCustomer = itemCustomer.customerName;
                product.productCustomerId = itemCustomer.customer;
                product.idCart = itemCustomer.idCart;
                resultAll.push(product);
            }
        }
        if(result.length) {
            res.render("manager/order", {
                cart : result,
                allCart : resultAll,
            });
        }
        else {
            res.render("manager/order", {
                message : "Order is empty",
                allCart : resultAll,
            });
        }
    }

    confirm(req, res, next) {
        const pid = req.query.pid;
        const cid = req.query.cid;
        const size = req.query.size;
        const idCart = req.query.idCart;
        Cart.findById({_id : idCart})
            .then(cart => {
                cart.product = cart.product.map(product => {
                    if(product.id === pid && product.size === size) {
                        product.status = 1;
                    }
                    return product;
                });   
                return cart.product;
            })
            .then(product => {
                Cart.findByIdAndUpdate({_id : idCart}, {product : product}, function(err) {
                    next(err);
                })
                res.redirect('back');
            })
            .catch(next);
    }
}

module.exports = new CartController();
