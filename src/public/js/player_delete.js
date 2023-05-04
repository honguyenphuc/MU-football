document.addEventListener("DOMContentLoaded", function () {
  var playerId;
  var btnDel = document.querySelector("#btn-del");
  var formDelete = document.querySelector("#delete-player");
  $("#confirmDelete").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget);
    playerId = button.data("id");
  });
  btnDel.onclick = function (event) {
    formDelete.action = "/manager/" + playerId + "?_method=DELETE";
    formDelete.submit();
  };
});
