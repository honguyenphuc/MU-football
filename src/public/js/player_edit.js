//Xử lý dữ liệu trả về
//Postion
var sel_position = document.querySelector(".sel-position");
var positionValue = document.querySelector(".sel-position").id;
var optPosition = document.querySelectorAll(".sel-position option");
for (var opt of optPosition) {
  if (opt.value == positionValue) {
    opt.setAttribute("selected", true);
    sel_position.removeAttribute("value");
  }
}
