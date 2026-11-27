

(function () {
  var SESSION_KEY = "metroCinema:session";
  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  if (currentPage === "logout.html") {
    document.querySelectorAll(".logout-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sessionStorage.removeItem(SESSION_KEY);
      });
    });
  }
})();
