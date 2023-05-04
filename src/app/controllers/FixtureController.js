const Schedule = require("../models/Schedule");

class FixtureController {
  //[GET] fixture
  index(req, res, next) {
    Schedule.find({})
    .lean()
    .sort({'time': 1})
    .then(matchs => {
        let result = [];
        for(let match of matchs) {
            if(match.time.getMonth() === new Date().getMonth() && match.time > new Date()) {
                match.date = match.time.toDateString().slice(0,10);
                match.time = match.time.toTimeString().slice(0,5);
                if(match.home) {
                    match.clubHome = 'ManUtd';
                    match.imageClubHome = 'img/fisrt-tem.png';
                    match.clubAway = match.club;
                    match.imageClubAway = match.imageClub;
                }
                else {
                    match.clubAway = 'ManUtd';
                    match.imageClubAway = 'img/fisrt-tem.png';
                    match.clubHome = match.club;
                    match.imageClubHome = match.imageClub;
                }
                result.push(match);
            }
        }
        if(result.length > 0) {
            res.render("component/competition", {
                match : result,
            });
        }
        else {
            res.render('component/competition', {
                message : "No more matches this month",
            })
        }
        
    })
  }

  
}

module.exports = new FixtureController();
