const API_KEY = "aac46808dee81ba0b36f3177518f3a48";

// 🟢 Charger les films populaires
function loadPopularMovies() {
    const moviesTitle = document.getElementById("moviesTitle");
    const moviesContainer = document.getElementById("moviesContainer");

    moviesTitle.style.display = "block";
    moviesContainer.innerHTML = "";

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";

                const movieCard = `
    <div class="col-md-3 mb-4">
        <div class="movie-card">
            <div class="poster-wrapper">
                <a href="film.html?id=${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                </a>
                <div class="movie-overlay">
                    <div class="movie-meta">⭐ ${movie.vote_average} | ${year}</div>
                    <div class="btn-group">
                        <button class="btn-custom btn-fav" onclick="event.stopPropagation(); addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">Favoris</button>
                        <button class="btn-custom btn-info" onclick="event.stopPropagation(); window.location.href='film.html?id=${movie.id}'">+ d'infos</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

                moviesContainer.innerHTML += movieCard;
            });
        })
        .catch(error => console.error("Erreur API :", error));
}

// 🟢 Rechercher des films
function searchMovies() {
    const query = document.getElementById("searchInput").value;
    const moviesTitle = document.getElementById("moviesTitle");
    const moviesContainer = document.getElementById("moviesContainer");

    if (!query) {
        moviesTitle.innerText = "🎬 Tendances";
        loadPopularMovies();
        return;
    }

    moviesTitle.innerText = "🔎 Résultats de recherche";
    moviesTitle.style.display = "block";
    moviesContainer.innerHTML = "";

    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";

                const movieCard = `
                    <div class="col-md-3 mb-4">
                        <div class="movie-card">
                            <div class="poster-wrapper">
                                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                                <div class="movie-overlay">
                                    <div class="movie-meta">⭐ ${movie.vote_average} | ${year}</div>
                                    <div class="btn-group">
                                        <button class="btn-custom btn-fav" onclick="event.stopPropagation(); addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">Favoris</button>
                                        <button class="btn-custom btn-info" onclick="event.stopPropagation(); window.location.href='film.html?id=${movie.id}'">+ d'infos</button>
                                    </div>
                                </div>
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

// 🟢 Supprimer un film des favoris
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(movie => movie.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
}

// 🟢 Afficher les films favoris
function loadFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p class='text-center'>Aucun film en favori.</p>";
        return;
    }

    favorites.forEach(movie => {
        const movieCard = `
            <div class="col-md-3 mb-4">
                <div class="card bg-black text-white">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <button class="btn btn-danger" onclick="removeFromFavorites(${movie.id})">Supprimer</button>
                        <a href="film.html?id=${movie.id}" class="btn btn-info ms-2">+ d'infos</a>
                    </div>
                </div>
            </div>
        `;
        favoritesContainer.innerHTML += movieCard;
    });
}

// 🟢 Écouteur bouton recherche
document.getElementById("searchButton").addEventListener("click", searchMovies);

// 🟢 Page de favoris
if (window.location.pathname.includes("favoris.html")) {
    document.addEventListener("DOMContentLoaded", loadFavorites);
}

// 🟢 Page d'accueil
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    document.addEventListener("DOMContentLoaded", loadPopularMovies);
}
