const API_KEY = "aac46808dee81ba0b36f3177518f3a48";

// 🟢 Récupérer l'ID de l'acteur depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get("actorId");

// 🟢 Charger les détails de l'acteur
function loadActorDetails() {
    const actorHeader = document.getElementById("actorHeader");

    if (!actorId) {
        actorHeader.innerHTML = "<p class='text-center'>Aucun acteur sélectionné.</p>";
        return;
    }

    const url = `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(actor => {
            actorHeader.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w300${actor.profile_path}" alt="${actor.name}">
                <div class="actor-info">
                    <h2 class="fw-bold text-warning">${actor.name}</h2>
                    <p>${actor.biography ? actor.biography.substring(0, 300) + "..." : "Biographie non disponible."}</p>
                    <p>📅 Né le : ${actor.birthday || "Inconnu"} (${actor.place_of_birth || "Lieu inconnu"})</p>
                </div>
            `;
        })
        .catch(error => console.error("Erreur API Acteur :", error));
}

// 🟢 Charger la filmographie de l'acteur
function loadActorMovies() {
    const moviesContainer = document.getElementById("moviesContainer");

    if (!actorId) {
        moviesContainer.innerHTML = "<p class='text-center'>Aucun acteur sélectionné.</p>";
        return;
    }

    const url = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}&language=fr-FR`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const movies = data.cast.slice(0, 8);
            moviesContainer.innerHTML = "";

            movies.forEach(movie => {
                moviesContainer.innerHTML += `
    <div class="col-md-3">
        <a href="platformes.html?movieId=${movie.id}" class="text-decoration-none">
            <div class="card bg-dark text-white border-light shadow-lg movie-card mb-3">
                <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'img/placeholder.png'}" class="card-img-top" alt="${movie.title}">
                <div class="card-body text-center">
                    <h6 class="fw-bold">${movie.title}</h6>
                    <p>📅 Sortie : ${movie.release_date || "Inconnu"}</p>
                </div>
            </div>
        </a>
    </div>
`;

            });
        })
        .catch(error => console.error("Erreur API Films :", error));
}

// 🟢 Charger les données au démarrage
loadActorDetails();
loadActorMovies();
