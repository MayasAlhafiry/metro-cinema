// Dynamic navbar, role protection, auth, and homepage rendering

(function () {
  var SESSION_KEY = "metroCinema:session";

  // Links shown in navbar for each role
  var navLinks = {
    guest: [
      { label: "Home", href: "index.html" },
      { label: "Movies", href: "movies.html" },
      { label: "Sign up", href: "user-signup.html" },
      { label: "Login", href: "login.html" }
    ],
    user: [
      { label: "Home", href: "index.html" },
      { label: "Movies", href: "movies.html" },
      { label: "Search", href: "search.html" },
      { label: "My Reviews", href: "my-reviews.html" },
      { label: "Logout", href: "logout.html" }
    ],
    admin: [
      { label: "Home", href: "index.html" },
      { label: "Dashboard", href: "admin-dashboard.html" },
      { label: "Manage Movies", href: "manage-movies.html" },
      { label: "Add Movie", href: "add-movie.html" },
      { label: "Review Requests", href: "review-requests.html" },
      { label: "Logout", href: "logout.html" }
    ]
  };

  // Pages restricted to a specific role
  var protectedPages = {
    "my-reviews.html": "user",
    "admin-dashboard.html": "admin",
    "manage-movies.html": "admin",
    "add-movie.html": "admin",
    "edit-movie.html": "admin",
    "delete-movie.html": "admin",
    "review-requests.html": "admin",
    "reject-review.html": "admin"
  };

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (err) {
      return null;
    }
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // 1. Determine current role and protect restricted pages
  var session = getSession();
  var role = session && (session.role === "user" || session.role === "admin")
    ? session.role
    : "guest";

  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  if (session && (
      currentPage === "login.html" ||
      currentPage === "user-signup.html" ||
      currentPage === "admin-signup.html"
  )) {
      window.location.replace(
          role === "admin" ? "admin-dashboard.html" : "movies.html"
      );
      return;
  }


  var requiredRole = protectedPages[currentPage];

  if (requiredRole && role !== requiredRole) {
    if (role === "guest") {
      window.location.replace("login.html");
    } else {
      window.location.replace("index.html?access=denied");
    }
    return;
  }

  // 2. Render dynamic navbar
  function renderNavbars() {
    var roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
    var linksHtml = navLinks[role]
      .map(function (link) {
        return '<a href="' + link.href + '">' + link.label + "</a>";
      })
      .join("");

    document.querySelectorAll(".navs").forEach(function (box) {
      box.innerHTML =
        '<nav aria-label="' + role + ' navigation">' +
        '<span class="role">' + roleLabel + "</span>" +
        linksHtml +
        "</nav>";
    });
  }

  // 3. Render homepage movies from storage
  function renderMovieCard(movie) {
    var slug = movie.slug || movie.id;
    var posterClass = movie.cssClass ? " " + escapeHtml(movie.cssClass) : "";
    var styleParts = [];
    if (!movie.cssClass) {
      styleParts.push("--a:#221829;--b:#8f2a3a");
    }
    if (movie.poster) {
      styleParts.push("--img:url('" + escapeHtml(movie.poster) + "')");
    }
    var posterStyle = styleParts.length ? ' style="' + styleParts.join(";") + '"' : "";
    var posterLabel = movie.arabicTitle
      ? '<b class="ar">' + escapeHtml(movie.arabicTitle) + "</b>"
      : "<b>" + escapeHtml(movie.title) + "</b>";

    var detailsHtml = "";
    if (movie.stars) {
      detailsHtml += '<div class="stars">' + escapeHtml(movie.stars) + "</div>";
    }
    if (movie.review) {
      detailsHtml += '<p class="review">' + escapeHtml(movie.review) + "</p>";
    }
    detailsHtml += '<span class="user">' + escapeHtml(movie.reviewer || movie.genre || "") + "</span>";

    return (
      '<a href="movie-details.html#' + encodeURIComponent(slug) + '" class="card" style="color:inherit;text-decoration:none">' +
        '<div class="poster' + posterClass + '"' + posterStyle + ">" + posterLabel + "</div>" +
        '<div class="info">' +
          "<h3>" + escapeHtml(movie.title) + " <small>" + escapeHtml(movie.year) + "</small></h3>" +
          detailsHtml +
        "</div>" +
      "</a>"
    );
  }

  function renderHomeMovies() {
    var home = document.querySelector("[data-home-movies]");
    if (!home || !window.MetroStorage) {
      return;
    }

    var notice = "";
    if (window.location.search.includes("access=denied")) {
      notice = '<p class="role" style="display:inline-block;margin:1rem 0;">Access denied for your account role.</p>';
    }

    var movies = window.MetroStorage.get("movies");
    var marvel = movies.filter(function (m) { return m.category === "Marvel"; });
    var egyptian = movies.filter(function (m) { return m.category === "Egyptian"; });
    var other = movies.filter(function (m) {
      return m.category !== "Marvel" && m.category !== "Egyptian";
    });

    var sections = [
      { title: "Marvel Films", list: marvel },
      { title: "Egyptian Films", list: egyptian },
      { title: "More Films", list: other }
    ];

    home.innerHTML =
      notice +
      sections
        .filter(function (section) { return section.list.length > 0; })
        .map(function (section) {
          return (
            "<section>" +
              '<h2 class="section-title">' + section.title + "</h2>" +
              '<div class="movie-grid">' +
                section.list.map(renderMovieCard).join("") +
              "</div>" +
            "</section>"
          );
        })
        .join("");
  }

  // 4. Simple login, signup, and logout handlers
  function setupAuthForms() {
    var storage = window.MetroStorage;
    if (!storage) {
      return;
    }

    // login page
    var loginForm = document.querySelector('form[data-auth="login"]');
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(loginForm);
        var username = String(data.get("username") || "").trim().toLowerCase();
        var password = String(data.get("password") || "");

        var user = storage.get("users").find(function (u) {
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
    }

    // signup page
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
      passwordInput.addEventListener("input", validatePassword)
      confirmInput.addEventListener("input", validatePassword)

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
        })
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

    // logout 
    if (currentPage === "logout.html") {
      document.querySelectorAll(".logout-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          sessionStorage.removeItem(SESSION_KEY);
        });
      });
    }
  }

  renderNavbars();
  renderHomeMovies();
  setupAuthForms();
})();
