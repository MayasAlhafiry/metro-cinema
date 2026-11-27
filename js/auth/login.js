

(function () {
  var SESSION_KEY = "metroCinema:session";

  var loginForm = document.querySelector('form[data-auth="login"]');

  if (!loginForm || !window.MetroStorage) {
    return;
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = new FormData(loginForm);
    var username = String(data.get("username") || "").trim().toLowerCase();
    var password = String(data.get("password") || "");

    var user = window.MetroStorage.get("users").find(function (u) {
      return u.username.toLowerCase() === username && u.password === password;
    });

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id: user.id, username: user.username, role: user.role })
    );

    window.location.href = user.role === "admin" ? "admin-dashboard.html" : "movies.html";
  });
})();
