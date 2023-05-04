document.addEventListener("DOMContentLoaded", function () {
    var productId;
    var btnDel = document.querySelector("#btn-del");
    var formDelete = document.querySelector("#delete-product");
    $("#confirmDeleteProduct").on("show.bs.modal", function (event) {
      var button = $(event.relatedTarget);
      productId = button.data("id");
    });
    btnDel.onclick = function (event) {
      formDelete.action = "/manager/product/" + productId + "?_method=DELETE";
      formDelete.submit();
    };
  });
  