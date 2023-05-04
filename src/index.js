const path = require("path");
const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const morgan = require("morgan");
const methodOverride = require("method-override");
const engine = require("express-handlebars").engine;
const jwt = require("jsonwebtoken");
const Account = require("./app/models/Account");

const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const route = require("./routes/index.route");
const db = require("./config/db/index");
//Connect to database
db.connect();

//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1/football_club_dev' })
}));

//express file static
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/account", express.static(path.join(__dirname, "public")));
app.use("/player", express.static(path.join(__dirname, "public")));
app.use("/product/:id", express.static(path.join(__dirname, "public")));
app.use("/product", express.static(path.join(__dirname, "public")));
app.use("/ticket", express.static(path.join(__dirname, "public")));
app.use("/ticket/:id", express.static(path.join(__dirname, "public")));
app.use("/ticket/shipping", express.static(path.join(__dirname, "public")));
app.use("/news", express.static(path.join(__dirname, "public")));
app.use("/player/:id", express.static(path.join(__dirname, "public")));
app.use("/manager", express.static(path.join(__dirname, "public")));
app.use("/manager/order", express.static(path.join(__dirname, "public")));
app.use("/manager/match", express.static(path.join(__dirname, "public")));
app.use("/manager/match/:id", express.static(path.join(__dirname, "public")));
app.use("/manager/player", express.static(path.join(__dirname, "public")));
app.use("/manager/news", express.static(path.join(__dirname, "public")));
app.use("/manager/product", express.static(path.join(__dirname, "public")));
app.use("/manager/product/:id/", express.static(path.join(__dirname, "public")));
app.use("/manager/player/:id/", express.static(path.join(__dirname, "public")));
app.use("/manager/news/:id/", express.static(path.join(__dirname, "public")));
app.use("/manager/account/", express.static(path.join(__dirname, "public")));
app.use("/manager/account/:id/", express.static(path.join(__dirname, "public")));

//Middleware body parser
app.use(express.urlencoded({ extended: true })); // Xử lý dữ liệu gửi lên từ form
app.use(express.json()); // Xử lý dữ liệu gửi lên từ JS

app.use(cookieParser()); // Thao tac voi cookie

//HTTP logger
app.use(morgan("combined"));

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources\\views"));

app.get('*', function (req, res, next) {
  res.locals.cart = req.session.cart;
  next();
});

app.get('*', function(req, res, next) {
  try {
    var token = req.cookies.account;
    var id_req = jwt.verify(token, "bayga");
    var id = id_req._id;
    Account.findOne({ _id: id })
      .then((account) => {
        if (account.admin) {
          res.locals.admin = true;
          next();
        } else {
          next();
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: "Lỗi server" + err.message,
        });
      });
  } catch (err) {
    next();
  }
});

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
