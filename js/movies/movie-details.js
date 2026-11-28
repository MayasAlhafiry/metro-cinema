let movies = MetroStorage.get("movies");
let movieId = new URLSearchParams(window.location.search).get("id");
let slug = window.location.hash.slice(1);
let movie;

// Find the selected movie
for (let item of movies) {
    if (String(item.id) === movieId ||
        (slug && encodeURIComponent(item.slug || item.id) === slug)) {
        movie = item;
        break;
    }
}

// Display movie information
if (movie) {
    document.getElementById("select-message").hidden = true;
    document.getElementById("movie-detail").hidden = false;

    document.getElementById("movie-title").textContent = movie.title;
    document.getElementById("movie-id").textContent = movie.id;
    document.getElementById("title").textContent = movie.title;
    document.getElementById("genre").textContent = movie.genre;
    document.getElementById("year").textContent = movie.releaseYear || movie.year;
    document.getElementById("director").textContent = movie.director;
    document.getElementById("description").textContent = movie.description;

   let creator = null;

       if (movie.createdBy) {
      creator = MetroStorage.get("users", movie.createdBy);
       }
    document.getElementById("created-by").textContent =
        creator ? creator.username : "Not recorded";

    document.getElementById("average-rating").textContent =
        getAverageRating(movie.id);

    // Display poster
    let poster = document.getElementById("movie-poster");
    poster.className = "poster " + (movie.cssClass || "");

    if (movie.poster) {
        poster.style.backgroundImage = `url("${movie.poster}")`;
    }

    poster.querySelector("b").textContent = movie.title;

    // Display approved reviews
    let reviews = getApprovedReviews(movie.id);
    let reviewList = document.getElementById("approved-reviews");

    if (reviews.length === 0) {
        reviewList.textContent = "No approved reviews yet.";
    }

    for (let review of reviews) {
        let user = MetroStorage.get("users", review.userId);
        let paragraph = document.createElement("p");

        paragraph.textContent =
            (user ? user.username : "User") + " — ★ " +
            review.rating + "/5 — " + review.comment;

        reviewList.appendChild(paragraph);
    }

    document.getElementById("review-form").dataset.movieId = movie.id;
}