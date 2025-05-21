const API_KEY = "aac46808dee81ba0b36f3177518f3a48";

// 🟢 Récupérer l'ID du film depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movieId");

if (!movieId) {
    document.getElementById("platformContainer").innerHTML = "<p class='text-center'>Aucun film sélectionné.</p>";
} else {
    loadMovieDetails();
    loadPlatformProviders();
}

// 🟢 Liste des plateformes avec leurs liens et logos
const streamingLinks = {
    "Netflix": { url: "https://www.netflix.com/search?q=", logo: "img/netflix.png" },
    "Prime Video": { url: "https://www.amazon.com/s?k=", logo: "img/prime.png" },
    "Disney+": { url: "https://www.disneyplus.com/search?q=", logo: "img/disney.png" },
    "Apple TV": { url: "https://tv.apple.com/search?term=", logo: "img/apple.png" },
    "YouTube": { url: "https://www.youtube.com/results?search_query=", logo: "img/youtube.png" },
    "Canal+": { url: "https://www.canalplus.com/", logo: "img/canal.png" },
    "Rakuten TV": { url: "https://www.rakuten.tv/fr", logo: "img/rakuten.png" },
    "Gratuit": { url: "https://www.justwatch.com/fr/rechercher?q=", logo: "img/free.png" }
};

// 🟢 Charger les détails du film
function loadMovieDetails() {
    const movieHeader = document.getElementById("movieHeader");

    if (!movieId) {
        movieHeader.innerHTML = "<p class='text-center'>Aucun film sélectionné.</p>";
        return;
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(movie => {
            movieHeader.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.overview.length > 200 ? movie.overview.substring(0, 200) + "..." : movie.overview}</p>
                    <p>📅 Sortie : ${movie.release_date}</p>
                    <p>⭐ Note : ${movie.vote_average}</p>
                </div>
            `;
        })
        .catch(error => console.error("Erreur API :", error));
}

// 🟢 Charger les plateformes de streaming
function loadPlatformProviders() {
    const platformContainer = document.getElementById("platformContainer");

    if (!movieId) {
        platformContainer.innerHTML = "<p class='text-center'>Aucun film sélectionné.</p>";
        return;
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const providers = data.results.FR; // Récupérer les plateformes disponibles en France

            let providerList = "<h4>Disponible sur :</h4><ul class='list-group platform-list'>";
            
            // 🟢 Ajouter les plateformes payantes
            if (providers && providers.flatrate) {
                providers.flatrate.forEach(provider => {
                    if (streamingLinks[provider.provider_name]) {
                        providerList += `<li class='list-group-item bg-dark text-white d-flex align-items-center'>
                            <img src="${streamingLinks[provider.provider_name].logo}" alt="${provider.provider_name}" class="me-2" width="40">
                            <a href="${streamingLinks[provider.provider_name].url}${movieId}" target="_blank" class="text-info">${provider.provider_name}</a>
                        </li>`;
                    } else {
                        providerList += `<li class='list-group-item bg-dark text-white'>${provider.provider_name}</li>`;
                    }
                });
            }

            // 🟢 Ajouter les plateformes gratuites
            providerList += `<li class='list-group-item bg-dark text-white d-flex align-items-center'>
                <img src="${streamingLinks["Gratuit"].logo}" alt="Gratuit" class="me-2" width="40">
                <a href="${streamingLinks["Gratuit"].url}${movieId}" target="_blank" class="text-success">Voir gratuitement</a>
            </li>`;

            providerList += "</ul>";

            platformContainer.innerHTML = providerList;
        })
        .catch(error => console.error("Erreur API :", error));
}

// 🟢 Charger les acteurs du film depuis l'API TMDB
function loadActors() {
    const actorsList = document.getElementById("actorsList");

    if (!movieId) {
        actorsList.innerHTML = "<p class='text-center'>Aucun film sélectionné.</p>";
        return;
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const actors = data.cast.slice(0, 10); // 🟢 Limite à 10 acteurs pour le carrousel
            actorsList.innerHTML = "";

            let actorsHTML = '<div class="carousel-item active"><div class="d-flex justify-content-center gap-3">';

            actors.forEach((actor, index) => {
                actorsHTML += `
                    <a href="acteur.html?actorId=${actor.id}" class="text-decoration-none">
                        <div class="card bg-dark text-white border-light shadow-lg" style="width: 150px;">
                            <img src="https://image.tmdb.org/t/p/w300${actor.profile_path}" class="card-img-top" alt="${actor.name}">
                            <div class="card-body text-center">
                                <h6 class="fw-bold">${actor.name}</h6>
                                <p class="text-info">${actor.character}</p>
                            </div>
                        </div>
                    </a>
                `;

                if ((index + 1) % 5 === 0 && index !== actors.length - 1) {
                    actorsHTML += '</div></div><div class="carousel-item"><div class="d-flex justify-content-center gap-3">';
                }
            });

            actorsHTML += '</div></div>';
            actorsList.innerHTML = actorsHTML;
        })
        .catch(error => console.error("Erreur API Acteurs :", error));
}

// 🟢 Ajouter un film aux favoris
document.addEventListener("DOMContentLoaded", function () {
    const favoriteButton = document.getElementById("favoriteButton");
    const movieId = new URLSearchParams(window.location.search).get("movieId");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // 🟢 Vérifier si le film est déjà en favoris
    if (favorites.some(movie => movie.id == movieId)) {
        favoriteButton.innerText = "✅ En Favoris";
        favoriteButton.disabled = true;
    }

    // 🟢 Ajouter aux favoris lors du clic
    favoriteButton.addEventListener("click", function () {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`)
            .then(response => response.json())
            .then(movie => {
                if (!favorites.some(fav => fav.id == movie.id)) {
                    favorites.push({
                        id: movie.id,
                        title: movie.title,
                        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "img/placeholder.png"
                    });
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    favoriteButton.innerText = "✅ En Favoris";
                    favoriteButton.disabled = true;
                }
            })
            .catch(error => console.error("Erreur lors de l'ajout aux favoris :", error));
    });
});




// 🟢 Charger les données au démarrage
loadMovieDetails();
loadPlatformProviders();
loadActors();
