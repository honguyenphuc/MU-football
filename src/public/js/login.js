function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const formLogin = document.querySelector("#login-form");

formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formLogin);
  const res = Object.fromEntries(formData);

  fetch("http://localhost:3000/account/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(res),
  })
    .then((account) => account.json())
    .then((data) => {
      if (data.success) {
        setCookie("account", data.token, 365);
        localStorage.setItem("username", data.name);
        if(data.admin) {
          window.location = "http://localhost:3000/manager/order";
        }
        else {
          window.location = "http://localhost:3000/";
        }
      } else {
        swal("Rất tiếc!", data.message, "error");
      }
    })
    .catch((err) => console.log(err));
});
