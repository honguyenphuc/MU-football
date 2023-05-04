var username = localStorage.getItem("username");
const managerLi = document.querySelector("#manager-nav"); 
const userNavs = document.querySelectorAll(".user-nav");
const adminNavs = document.querySelectorAll(".admin-nav");
const cart = document.querySelector("#cart");

if (username) {
  var h1_name = document.querySelector("#username");
  var li_login = document.querySelector(".js_login_item");
  var li_username = document.querySelector(".js_username_item");
  h1_name.innerHTML = username;
  li_login.classList.add("hidden");
  li_username.classList.remove("hidden");
  cart.classList.remove("hidden");
}

if(managerLi.getAttribute("data-admin") == '') {
  managerLi.classList.add('hidden');
  adminNavs.forEach(nav => {
    nav.classList.add('hidden');
  });
  userNavs.forEach(nav => {
    nav.classList.remove('hidden');
  });
}
else {
  //admin
  cart.classList.add("hidden");
  managerLi.classList.remove('hidden');
  userNavs.forEach(nav => {
    nav.classList.add('hidden');
  });
  adminNavs.forEach(nav => {
    nav.classList.remove('hidden');
  });
}
//Gán tên lên localstogare

// Logout

var logout = document.querySelector("#logout");

logout.onclick = function () {
  localStorage.clear();
};


