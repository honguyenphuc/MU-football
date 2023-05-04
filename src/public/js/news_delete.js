document.addEventListener("DOMContentLoaded", function () {
  var newsId;
  var btnDel = document.querySelector("#btn-del");
  var formDelete = document.querySelector("#delete-news");
  $("#confirmDeleteNews").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    newsId = button.data("id");
  });
  btnDel.onclick = function (event) {
    formDelete.action = "/manager/news/" + newsId + "?_method=DELETE";
    formDelete.submit();
  };
});
