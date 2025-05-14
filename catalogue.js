const API_KEY = "aac46808dee81ba0b36f3177518f3a48";
let currentPage = 1;

// 🟢 Charger les films du catalogue
function loadMovies(genre = "", year = "", rating = "") {
    const moviesContainer = document.getElementById("moviesContainer");
    moviesContainer.innerHTML = "";

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&page=${currentPage}`;

    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                let shortOverview = movie.overview.length > 150 ? movie.overview.substring(0, 150) + "..." : movie.overview;

                const movieCard = `
                    <div class="col-md-3 mb-4">
                        <div class="card bg-black text-white movie-card position-relative">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                            <div class="movie-details">
                                <p>${shortOverview}</p>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">${movie.release_date}</p>
                                <p class="card-text">⭐ ${movie.vote_average}</p>
                                <button class="btn btn-warning mb-2" onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">Ajouter aux favoris</button>
                                <button class="btn btn-info" onclick="redirectToPlatform(${movie.id})">Où regarder ?</button>
                            </div>
                        </div>
                    </div>
                `;
                moviesContainer.innerHTML += movieCard;
            });
        })
        .catch(error => console.error("Erreur API :", error));
}

// 🟢 Ajouter un film aux favoris
function addToFavorites(id, title, poster) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const movie = { id, title, poster };

    if (!favorites.some(fav => fav.id === id)) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${title} ajouté aux favoris !`);
    } else {
        alert(`${title} est déjà dans les favoris.`);
    }
}

// 🟢 Redirection vers la page "Où regarder ?"
function redirectToPlatform(movieId) {
    window.location.href = `platformes.html?movieId=${movieId}`;
}

// 🟢 Appliquer les filtres
document.getElementById("filterForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;
    const rating = document.getElementById("rating").value;
    loadMovies(genre, year, rating);
});

// 🟢 Charger plus de films
document.getElementById("loadMoreButton").addEventListener("click", function() {
    currentPage++;
    loadMovies();
});

// Charger les films au démarrage
loadMovies();
