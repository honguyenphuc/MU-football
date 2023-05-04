const formRegister = document.querySelector("#register-form");

formRegister.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formRegister);
  const res = Object.fromEntries(formData);

  fetch("http://localhost:3000/account/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(res),
  })
    .then((account) => account.json())
    .then((data) => {
      if (data.success) {
        window.location = "http://localhost:3000/account";
      } else {
        swal("Sorry!", data.message, "error");
      }
    })
    .catch((err) => console.log(err));
});



