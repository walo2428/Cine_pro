const API_KEY = "aac46808dee81ba0b36f3177518f3a48";

// 🟢 Charger les films populaires
function loadPopularMovies() {
    const moviesTitle = document.getElementById("moviesTitle");
    const moviesContainer = document.getElementById("moviesContainer");

    moviesTitle.style.display = "block"; // Afficher le titre des films populaires
    moviesContainer.innerHTML = "";

    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`;

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
                                <button class="btn btn-warning me-2" onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">Ajouter aux favoris</button>                                <button class="btn btn-info" onclick="redirectToPlatform(${movie.id})">Où regarder ?</button>
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

    // 🟢 Si la barre de recherche est vide, réafficher les films populaires et masquer le titre des résultats
    if (!query) {
        moviesTitle.style.display = "block"; // Afficher le titre des films populaires
        loadPopularMovies(); // Recharger les films populaires
        return;
    }

    // 🟢 Modifier le titre et afficher uniquement les résultats
    moviesTitle.innerText = "🔎 Résultats de recherche";
    moviesTitle.style.display = "block"; // Afficher le titre des résultats
    moviesContainer.innerHTML = "";

    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            moviesContainer.innerHTML = ""; // Nettoyer les résultats précédents

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

// 🟢 Supprimer un film des favoris
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(movie => movie.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites(); // Recharger la liste après suppression
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
                    </div>
                </div>
            </div>
        `;
        favoritesContainer.innerHTML += movieCard;
    });
}

// 🟢 Redirection vers la page "Où regarder ?"
function redirectToPlatform(movieId) {
    window.location.href = `platformes.html?movieId=${movieId}`;
}

// 🟢 Vérifier si on est sur la page favoris et charger les favoris
if (window.location.pathname.includes("favoris.html")) {
    loadFavorites();
}

// 🟢 Écouteur d'événement pour la recherche
document.getElementById("searchButton").addEventListener("click", searchMovies);

// Charger les films populaires au démarrage
loadPopularMovies();



// ---------------------------------------FAVORIS---------------

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
                        <button class="btn btn-info" onclick="redirectToPlatform(${movie.id})">Où regarder ?</button>
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
