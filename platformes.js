const API_KEY = "aac46808dee81ba0b36f3177518f3a48";

// 🟢 Récupérer l'ID du film depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movieId");

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

// Charger les détails du film et les plateformes au démarrage
loadMovieDetails();
loadPlatformProviders();
