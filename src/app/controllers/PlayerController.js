const Player = require("../models/Player");

class PlayerController {
  getGK(req, res, next) {
    Player.find({ position: "GK" })
      .sort({ jersey_number: 1 })
      .lean()
      .then((players) => {
        req.gk = players;
        next();
      })
      .catch(next);
  }

  getDF(req, res, next) {
    Player.find({ position: "DF" })
      .sort({ jersey_number: 1 })
      .lean()
      .then((players) => {
        req.df = players;
        next();
      })
      .catch(next);
  }

  getMF(req, res, next) {
    Player.find({ position: "MF" })
      .sort({ jersey_number: 1 })
      .lean()
      .then((players) => {
        req.mf = players;
        next();
      })
      .catch(next);
  }

  getFW(req, res, next) {
    Player.find({ position: "FW" })
      .sort({ jersey_number: 1 })
      .lean()
      .then((players) => {
        req.fw = players;
        next();
      })
      .catch(next);
  }
  //[GET] player
  index(req, res, next) {
    Player.find({})
      .lean()
      .then((players) => {
        res.render("player/player", {
          gk: req.gk,
          df: req.df,
          mf: req.mf,
          fw: req.fw,
        });
      })
      .catch(next);
  }

  //[GET] player/:id
  player_detail(req, res, next) {
    var _id = req.params.id;
    Player.findById(_id)
      .lean()
      .then((player) => {
        //Xử lý age
        var dobTemp = new Date(player.dob);
        var yearNow = new Date();
        dobTemp.setFullYear(yearNow.getFullYear());
        var age;
        var dob = new Date(player.dob);
        yearNow < dobTemp
          ? (age = yearNow.getFullYear() - dob.getFullYear() - 1)
          : (age = yearNow.getFullYear() - dob.getFullYear());

        // Xử lý Position
        var fullPosition;
        switch (player.position) {
          case "GK":
            fullPosition = "Goalkeeper";
            break;
          case "DF":
            fullPosition = "Defender";
            break;
          case "MF":
            fullPosition = "Midfielder";
            break;
          case "FW":
            fullPosition = "Forward";
            break;
          default:
            fullPosition = "";
        }

        //Xử lý ngày
        var dates = [new Date(player.dob), new Date(player.joined)];
        for (var i = 0; i < dates.length; i++) {
          var year = dates[i].getFullYear();
          var month = String(dates[i].getMonth() + 1).padStart(2, "0");
          var day = dates[i].getDate().toString().padStart(2, "0");
          dates[i] = `${year}-${month}-${day}`;
        }
        player.dob = dates[0];
        player.joined = dates[1];

        res.render("player/player_detail", {
          player,
          age,
          fullPosition,
        });
      })
      .catch(next);
  }
}

module.exports = new PlayerController();
