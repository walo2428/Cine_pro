const API_KEY = "aac46808dee81ba0b36f3177518f3a48";

// 🟢 Charger les films populaires
function loadPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const popularMoviesContainer = document.getElementById("popularMoviesContainer");
            popularMoviesContainer.innerHTML = "";

            data.results.forEach(movie => {
                const movieCard = `
                    <div class="col-md-3 mb-4">
                        <div class="card bg-black text-white movie-card position-relative">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">${movie.release_date}</p>
                                <p class="card-text">⭐ ${movie.vote_average}</p>
                                <button class="btn btn-warning" onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">Ajouter aux favoris</button>
                            </div>
                            <!-- 🟢 Détails cachés au départ -->
                            <div class="movie-details">
                                <h5>${movie.title}</h5>
                                <p>${movie.overview}</p>
                                <p>📅 Sortie : ${movie.release_date}</p>
                                <p>⭐ Note : ${movie.vote_average}</p>
                            </div>
                        </div>
                    </div>
                `;
                popularMoviesContainer.innerHTML += movieCard;
            });
        })
        .catch(error => console.error("Erreur API :", error));
}

// 🟢 Rechercher des films
function searchMovies() {
    const query = document.getElementById("searchInput").value;
    if (!query) return;

    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const moviesContainer = document.getElementById("moviesContainer");
            moviesContainer.innerHTML = "";

           data.results.forEach(movie => {
    const movieCard = `
        <div class="col-md-3 mb-4">
            <div class="card bg-black text-white movie-card position-relative">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <!-- 🟢 Détails affichés à la place de l'image au survol -->
                <div class="movie-details">
                    <h5>${movie.title}</h5>
                    <p>${movie.overview}</p>
                    <p>📅 Sortie : ${movie.release_date}</p>
                    <p>⭐ Note : ${movie.vote_average}</p>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.release_date}</p>
                    <p class="card-text">⭐ ${movie.vote_average}</p>
                    <button class="btn btn-warning" onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">Ajouter aux favoris</button>
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

// 🟢 Écouteur d'événement pour la recherche
document.getElementById("searchButton").addEventListener("click", searchMovies);

// Charger les films populaires au démarrage
loadPopularMovies();



// ------------------------------------------------------

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
                    </div>
                </div>
            </div>
        `;
        favoritesContainer.innerHTML += movieCard;
    });
}

// 🟢 Supprimer un film des favoris
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(movie => movie.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites(); // Recharger la liste après suppression
}

// 🟢 Vérifier si on est sur la page favoris et charger les favoris
if (window.location.pathname.includes("favoris.html")) {
    loadFavorites();
}
