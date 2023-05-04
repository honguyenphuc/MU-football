const loginRouter = require("./accounts.route");
const playerRouter = require("./players.route");
const productRouter = require("./products.route");
const newsRouter = require("./news.route");
const managerRouter = require("./managers.route");
const fixtureRouter = require("./fixtures.route");

function route(app) {
  // route dang nhap
  app.use("/account", loginRouter);
  // route player
  app.use("/player", playerRouter);
  app.use("/product", productRouter);
  app.use("/news", newsRouter);

  app.use("/introduce", function(req, res, next) {
    res.render("component/intro");
  });

  app.use("/competition", fixtureRouter);

  app.use("/traditional", function(req, res, next) {
    res.render("component/traditional_room");
  });
  // route manager
  app.use("/manager", managerRouter);


  app.use("/", function(req, res, next) {
    res.render("component/intro");
  });

}

module.exports = route;
