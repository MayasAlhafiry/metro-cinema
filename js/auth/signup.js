

(function () {
  var storage = window.MetroStorage;

  if (!storage) {
    return;
  }

  document.querySelectorAll('form[data-auth="signup"]').forEach(function (form) {
    // validate password
    var passwordInput = form.querySelector("#password");
    var confirmInput = form.querySelector("#confirm-password");

    function validatePassword() {
      if(passwordInput.value !== confirmInput.value) {
        confirmInput.setCustomValidity("Passwords do not match")
      } else {
        confirmInput.setCustomValidity("")
      }
    }

    passwordInput.addEventListener("input", validatePassword);
    confirmInput.addEventListener("input", validatePassword);

    // get data from the form
    form.addEventListener("submit", function (event) {
      console.log("Signup clicked");
      event.preventDefault();

      var data = new FormData(form);
      var email = String(data.get("email") || "").trim().toLowerCase();
      var username = String(data.get("username") || "").trim().toLowerCase();
      var password = String(data.get("password") || "");

      // unique email
      var exists = storage.get("users").some(function (u) {
        return u.email.toLowerCase() === email;
      });

      if (exists) {
        alert("An account with this email already exists");
        return;
      }

      // unique username
      var usernameExists = storage.get("users").some(function (u) {
        return u.username.toLowerCase() === username
      });

      if(usernameExists) {
        alert("An account with this username already exists");
        return;
      }

      // role
      var signupRole = String(data.get("role") || "");

      // store tha data to create new account
      storage.add("users", {
        username: username,
        email: email,
        password: password,
        role: signupRole
      });

      // redirect to login after sigup
      window.location.href = "login.html";
    });
  });
})();
