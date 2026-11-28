let form = document.getElementById("search-form");
let results = document.getElementById("results");
let resultCount = document.getElementById("result-count");

function searchMovies() {
    let movies = MetroStorage.get("movies");

    let id = form.elements["id"].value;
    let title = form.elements["title"].value.trim().toLowerCase();
    let genre = form.elements["genre"].value.trim().toLowerCase();
    let year = form.elements["year"].value;
    let director = form.elements["director"].value.trim().toLowerCase();

    results.innerHTML = "";
    let count = 0;

    for (let movie of movies) {
        let movieYear = movie.releaseYear || movie.year;

        if (id && Number(id) !== movie.id)
            continue;

        if (!movie.title.toLowerCase().includes(title))
            continue;

        if (!movie.genre.toLowerCase().includes(genre))
            continue;

        if (year && Number(year) !== Number(movieYear))
            continue;

        if (!movie.director.toLowerCase().includes(director))
            continue;

        let link = document.createElement("a");

        link.href = "movie-details.html?id=" + movie.id;

        link.textContent = movie.title + " — ID: " + movie.id
            + " | " + movie.genre
            + " | " + movieYear
            + " | ★ " + getAverageRating(movie.id);

        results.appendChild(link);
        count++;
    }

    resultCount.textContent = count + " movie(s) found";

    if (count === 0) {
        results.textContent = "No movies found.";
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    searchMovies();
});

document.getElementById("clear-search").addEventListener("click", function () {
    form.reset();
   resultCount.textContent = "";
   results.textContent = "Enter your search criteria to find movies.";
});

results.textContent = "Enter your search criteria to find movies.";