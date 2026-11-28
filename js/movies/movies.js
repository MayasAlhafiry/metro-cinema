let movies = MetroStorage.get("movies");
let movieList = document.getElementById("movie-list");

let categories = ["Action & Adventure", "Comedy", "Drama & Mystery", "Other"];

// Decide which category each movie belongs to
function getCategory(movie) {
    let genre = movie.genre.toLowerCase();

    if (genre.includes("action") || genre.includes("adventure"))
        return "Action & Adventure";

    if (genre.includes("comedy"))
        return "Comedy";

    if (genre.includes("drama") || genre.includes("mystery") || genre.includes("thriller"))
        return "Drama & Mystery";

    return "Other";
}

// Create the original category rows
for (let category of categories) {
    let section = document.createElement("section");
    section.className = "category";

    section.innerHTML = `
        <div class="category-header">
            <h2 class="section-title"></h2>
            <div class="arrows">
                <button type="button" aria-label="Previous movies">❮</button>
                <button type="button" aria-label="Next movies">❯</button>
            </div>
        </div>
        <div class="movie-row"></div>
    `;

    section.querySelector("h2").textContent = category;

    let row = section.querySelector(".movie-row");

    for (let movie of movies) {
        if (getCategory(movie) === category) {
            let card = document.createElement("a");
            card.className = "card catalog-card";
            card.href = "movie-details.html?id=" + movie.id;

            card.innerHTML = `
                <div class="poster"><b></b></div>
                <div class="info">
                    <h3></h3>
                    <p></p>
                     <p class="rating"></p>
                </div>
            `;

            let poster = card.querySelector(".poster");
            poster.className = "poster " + (movie.cssClass || "");

            if (movie.poster)
                poster.style.backgroundImage = `url("${movie.poster}")`;

            card.querySelector("b").textContent = movie.arabicTitle || movie.title;

            if (movie.arabicTitle)
                card.querySelector("b").className = "ar";

            card.querySelector("h3").textContent = movie.title;
            card.querySelector("p").textContent =
                (movie.releaseYear || movie.year) + " · " + movie.genre;

                card.querySelector(".rating").textContent =
    "★ " + getAverageRating(movie.id);

            row.appendChild(card);
        }
    }

    let buttons = section.querySelectorAll("button");

    buttons[0].addEventListener("click", function () {
        row.scrollBy(-270, 0);
    });

    buttons[1].addEventListener("click", function () {
        row.scrollBy(270, 0);
    });

    if (row.children.length > 0)
        movieList.appendChild(section);
}