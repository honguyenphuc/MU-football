const { response } = require("express");
const format = require('date-fns').format;
const Player = require("../models/Player");
const News = require("../models/News");
const Product = require("../models/Product");
const Account = require("../models/Account");
const Schedule = require("../models/Schedule");

class ManagerController {
  //[GET] player-create
  player_create(req, res, next) {
    res.render("manager/player_create");
  }

  //[POST] player-create
  player_post(req, res, next) {
    var name = req.body.name;
    var avatar = "img/player/" + req.files["avatar"][0].originalname;
    var backgroundImage =
      "img/player/" + req.files["backgroundImage"][0].originalname;
    var jersey_number = req.body.jersey_number;
    var position = req.body.position;
    var dob = req.body.dob;
    var quote = req.body.quote;
    var biography = req.body.biography;
    var country = req.body.country;
    var joined = req.body.joined;
    Player.create(
      {
        name,
        avatar,
        backgroundImage,
        jersey_number,
        position,
        dob,
        quote,
        biography,
        country,
        joined,
      },
      function (err) {
        if (err) return handleError(err);
        else res.redirect("./player");
      }
    );
  }

  //[GET] player edit
  player_edit(req, res, next) {
    Player.findById(req.params.id)
      .lean()
      .then((player) => {
        var dates = [new Date(player.dob), new Date(player.joined)];
        for (var i = 0; i < dates.length; i++) {
          var year = dates[i].getFullYear();
          var month = String(dates[i].getMonth() + 1).padStart(2, "0");
          var day = dates[i].getDate().toString().padStart(2, "0");
          dates[i] = `${year}-${month}-${day}`;
        }
        player.dob = dates[0];
        player.joined = dates[1];
        res.render("manager/player_edit", {
          player,
        });
      });
  }

  //[PUT] player
  player_update(req, res, next) {
    var name = req.body.name;
    var avatar;
    req.files["avatar"] != undefined
      ? (avatar = "img/player/" + req.files["avatar"][0].originalname)
      : (avatar = req.body.avatar);

    var backgroundImage;
    req.files["backgroundImage"] != undefined
      ? (backgroundImage =
          "img/player/" + req.files["backgroundImage"][0].originalname)
      : (backgroundImage = req.body.backgroundImage);

    var jersey_number = req.body.jersey_number;
    var position = req.body.position;
    var dob = req.body.dob;
    var quote = req.body.quote;
    var biography = req.body.biography;
    var country = req.body.country;
    var joined = req.body.joined;
    Player.updateOne(
      { _id: req.params.id },
      {
        name,
        avatar,
        backgroundImage,
        jersey_number,
        position,
        dob,
        quote,
        biography,
        country,
        joined,
      },
      function (err) {
        if (err) return handleError(err);
        else res.redirect("/manager/player");
      }
    );
  }

  //[DELETE] player
  player_delete(req, res, next) {
    Player.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //[GET] Admin UI
  index(req, res, next) {
    res.render("manager/index");
  }

  //[GET] player
  player(req, res, next) {
    Player.find({})
      .lean()
      .then((players) => {
        for (var player of players) {
          var date = new Date(player.dob);
          var year = date.getFullYear();
          var month = String(date.getMonth() + 1).padStart(2, "0");
          var day = date.getDate().toString().padStart(2, "0");
          date = `${day}-${month}-${year}`;
          player.dob = date;
        }
        res.render("manager/player", {
          players,
        });
      })
      .catch(next);
  }

  //[GET] news
  news(req, res, next) {
    News.find({})
      .lean()
      .then((news) => {
        res.render("manager/news", {
          news,
        });
      })
      .catch(next);
  }

  //[GET] news-create
  news_create(req, res, next) {
    res.render("manager/news_create");
  }

  news_post(req, res, next) {
    var title = req.body.title;
    var headline_image = "img/news/" + req.file.originalname;
    var description = req.body.description;
    var content = req.body.content;
    var author = req.account;
    News.create({ title, headline_image, description, content, author })
      .then(() => res.redirect("./news"))
      .catch(next);
  }

  news_edit(req, res, next) {
    News.findById(req.params.id)
      .lean()
      .then((news) => {
        res.render("manager/news_edit", {
          news,
        });
      });
  }

  news_update(req, res, next) {
    var title = req.body.title;
    var headline_image;
    req.file != undefined
      ? (headline_image = "img/news/" + req.file.originalname)
      : (headline_image = req.body.headline_image);

    var description = req.body.description;
    var content = req.body.content;
    News.updateOne(
      { _id: req.params.id },
      {
        title,
        headline_image,
        description,
        content,
      },
      function (err) {
        if (err) return handleError(err);
        else res.redirect("/manager/news");
      }
    );
  }

  news_delete(req, res, next) {
    News.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  //[GET] product
  product(req, res, next) {
    Product.find({})
      .lean()
      .then((products) => {
        res.render("manager/product", {
          products,
        });
      })
      .catch(next);
  }

  product_create(req, res, next) {
    res.render("manager/product_create");
  }

  product_post(req, res, next) {
    var name = req.body.name;
    var productImage = "img/product/" + req.files[0].originalname;
    var productImages = [];
    for(let i = 0; i < req.files.length; i++) {
      productImages.push("img/product/" + req.files[i].originalname);
    }
    var description = req.body.description;
    var price = req.body.price;
    var type = req.body.type;
    var available = req.body.available;
    Product.create({ name, productImage, productImages, description, price, type, available })
      .then(() => res.redirect("./product"))
      .catch(next);
  }

  product_edit(req, res, next) {
    Product.findById(req.params.id)
      .lean()
      .then((product) => {
        res.render("manager/product_edit", {
          product,
        });
      });
  }

  product_update(req, res, next) {
    let name = req.body.name;
    var productImage;
    var productImages = [];
    let description = req.body.description;
    let type = req.body.type;
    let price = req.body.price;
    let available = req.body.available;
    if(req.files.length > 0) {
      productImage = "img/product/" + req.files[0].originalname;
      for(let i = 0; i < req.files.length; i++) {
        productImages.push("img/product/" + req.files[i].originalname);
      }
      Product.updateOne(
        { _id: req.params.id },
        {
          name,
          productImage,
          productImages,
          description,
          type,
          price,
          available,
        },
        function (err) {
          if (err) return handleError(err);
          else res.redirect("/manager/product");
        }
      );
    }
    else {
      Product.updateOne(
        { _id: req.params.id },
        {
          name,
          description,
          type,
          price,
          available
        },
        function (err) {
          if (err) return handleError(err);
          else res.redirect("/manager/product");
        }
      );
    }
  }

  product_delete(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  match(req, res, next) {
    Schedule.find({})
    .lean()
    .then(match => {
      match.forEach(match => {
        match.time = new Date(match.time);
        match.time = match.time.toLocaleTimeString() + " " + match.time.toDateString();
      })
      res.render("manager/schedule", {
        match
      });
    })
  }

  match_create(req, res, next) {
    res.render("manager/match_create");
  }

  match_post(req, res, next) {
    let club = req.body.competitor;
    let imageClub = "img/match/" + req.file.originalname;
    let time = req.body.time;
    let tournament = req.body.tournament;
    let home = req.body.home === 'home' ? true : false;
    Schedule.create({ club, imageClub, time, tournament, home })
      .then(() => res.redirect("./match"))
      .catch(next);
  }

  match_edit(req, res, next) {
    Schedule.findById(req.params.id)
      .lean()
      .then((match) => {
        match.time = format(new Date(match.time), 'yyyy-MM-dd\'T\'HH:mm', { awareOfUnicodeTokens: true });
        res.render("manager/match_edit", {
          match,
        });
      });
  }

  match_update(req, res, next) {
    let _id = req.params.id;
    let club = req.body.competitor;
    let imageClub;
    if(req.file) {
      imageClub = "img/match/" + req.file.originalname;
    }
    else {
      imageClub = req.body.logo;
    }
    let time = req.body.time;
    let tournament = req.body.tournament;
    let home = req.body.home === 'home' ? true : false;
    Schedule.findByIdAndUpdate({_id},{ club, imageClub, time, tournament, home })
      .then(() => res.redirect("./"))
      .catch(next);
  }

  match_delete(req, res, next) {
    Schedule.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  account(req, res, next) {
    Account.find({})
      .lean()
      .then((accounts) => {
        res.render("manager/account", {
          accounts,
        });
      })
      .catch(next);
  }

  account_create(req, res, next) {
    res.render("manager/account_create");
  }

  account_post(req, res, next) {
    var email = req.body.email;
    Account.findOne({email})
      .then((account) => {
        if(account) {
          res.render('manager/account_create', {
            success:false,
            message: "Email already exists!",
            admin: true,
          });
        }
        else {
          next();
        }
      })
  }

  account_add(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var admin = req.body.admin == 'admin' ? true : false;
    Account.create(
      {
        name,
        email,
        password,
        admin,
      },
      function (err) {
        if (err) return handleError(err);
        else res.redirect("./account");
      }
    );
  }

  account_edit(req, res, next) {
    Account.findById(req.params.id)
      .lean()
      .then((account) => {
        res.render("manager/account_edit", {
          account,
        });
      });
  }

  account_update(req, res, next) {
    var admin = req.body.admin == 'admin' ? true : false;
    Account.updateOne(
      { _id: req.params.id },
      {
        admin
      },
      function (err) {
        if (err) return handleError(err);
        else res.redirect("/manager/account");
      }
    );
  }

  account_delete(req, res, next) {
    Account.deleteOne({ _id: req.params.id })
      .then(() => res.redirect("back"))
      .catch(next);
  }

  cancelProduct(req, res, next) {
    const productId = req.params.id;
    const size = req.query.size;
    let products  = req.product;
    products.map(product => {
      if(product.id == productId && product.size == size) {
        product.status = 3;
        next();
      }
    });
    console.log(products);
    next();
  }

}

module.exports = new ManagerController();
