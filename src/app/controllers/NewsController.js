const News = require("../models/News");
const Account = require("../models/Account");

class NewsController {
  news_detail(req, res, next) {
    var _id = req.params.id;
    News.findById(_id)
      .lean()
      .then((news) => {
        //Lay ten tac gia
        var authorId = news.author.toString();
        Account.findById(authorId)
          .lean()
          .then((author) => (news.authorName = author.name))
          .catch(next);

        //Lay ngay gio
        var day = news.createdAt.getDay();
        switch (day) {
          case 1:
            day = "Monday";
            break;
          case 2:
            day = "Tuesday";
            break;
          case 3:
            day = "Wednesday";
            break;
          case 4:
            day = "Thurday";
            break;
          case 5:
            day = "Friday";
            break;
          case 6:
            day = "Saturday";
            break;
          default:
            day = "Sunday";
        }
        var date = news.createdAt.getDate();
        var month = news.createdAt.getMonth();
        switch (month) {
          case 0:
            month = "Jan";
            break;
          case 1:
            month = "Feb";
            break;
          case 2:
            month = "Mar";
            break;
          case 3:
            month = "Apr";
            break;
          case 4:
            month = "May";
            break;
          case 5:
            month = "Jun";
            break;
          case 6:
            month = "Jul";
            break;
          case 7:
            month = "Aug";
            break;
          case 8:
            month = "Sep";
            break;
          case 9:
            month = "Oct";
            break;
          case 10:
            month = "Nov";
            break;
          default:
            month = "Dec";
        }

        var year = news.createdAt.getFullYear();
        var minutes = news.createdAt.getMinutes();
        var hours = news.createdAt.getHours();
        news.createdTime = `${day} ${date} ${month} ${year} ${hours}:${minutes}`;
        res.render("news/news_detail", {
          news,
        });
      })
      .catch(next);
  }

  getCountDocuments(req, res, next) {
    News.count({})
      .then((count) => {
        var page = [];
        if (count / 10 > 1) {
          for (var i = 0; i < Math.floor(count / 10) + 1; i++) {
            page.push(i + 1);
          }
          req.page = page;
        }
        next();
      })
      .catch(next);
  }
  //[GET] news
  index(req, res, next) {
    const PAGE_SIZE = 10;
    if (req.query.page < 1) {
      req.query.page = 1;
    }
    const page_count = req.query.page - 1;
    News.find({})
      .sort({ createdAt: -1 })
      .skip(PAGE_SIZE * page_count)
      .limit(PAGE_SIZE)
      .lean()
      .then(async (news) => {
        //Xử lý ngày giờ đăng
        var nowDate = new Date();

        for (var i in news) {
          var second = Math.floor((nowDate - news[i].createdAt) / 1000); //Số giây kể từ khi tạo bài viết
          if (second >= 0 && second < 60) {
            news[i].createString = "Just now";
          } else if (second >= 60 && second < 3600) {
            var cal = Math.floor(second / 60);
            news[i].createString = `${cal}m`;
          } else if (second >= 3600 && second < 86400) {
            var cal = Math.floor(second / 3600);
            news[i].createString = `${cal}h`;
          } else if (second >= 86400 && second < 604800) {
            var cal = Math.floor(second / 86400);
            news[i].createString = `${cal}d`;
          } else if (second >= 604800 && second < 1209600) {
            var cal = Math.floor(second / 604800);
            news[i].createString = `${cal}w`;
          } else {
            var day = news[i].createdAt.getDate();
            var month = news[i].createdAt.getMonth() + 1;
            news[i].createString = `${month}-${day}`;
          }
        }

        // Lấy tên tác giả
        for (var i in news) {
          var authorId = news[i].author.toString();
          await Account.findById(authorId)
            .lean()
            .then((author) => {
              news[i].authorName = author.name;
            })
            .catch(next);
        }
        res.render("news/news", {
          news,
          page: req.page,
        });
      })
      .catch(next);
  }
}

module.exports = new NewsController();
