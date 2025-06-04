const API_KEY = "aac46808dee81ba0b36f3177518f3a48";
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

const movieBanner = document.getElementById("movieBanner");
const actorsCarousel = document.getElementById("actorsCarousel");
const actorName = document.getElementById("actorName");
const actorBio = document.getElementById("actorBio");
const actorMovies = document.getElementById("actorMovies");

if (movieId) {
  // Charger les détails du film
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`)
    .then(res => res.json())
    .then(movie => {
      movieBanner.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <div class="movie-details">
          <h1>${movie.title}</h1>
          <p><strong>Date de sortie :</strong> ${movie.release_date}</p>
          <p><strong>Note :</strong> ⭐ ${movie.vote_average}</p>
          <p><strong>Durée :</strong> ${movie.runtime} min</p>
          <p><strong>Genres :</strong> ${movie.genres.map(g => g.name).join(", ")}</p>
          <p class="mt-4">${movie.overview}</p>
          <button class="btn-fav" onclick="addToFavorites(${movie.id}, '${movie.title}', '${movie.poster_path}')">
            Ajouter aux favoris
          </button>
        </div>
      `;
    });

  // Charger les acteurs
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`)
    .then(res => res.json())
    .then(data => {
      data.cast.slice(0, 12).forEach(actor => {
        const div = document.createElement("div");
        div.className = "actor-card";
        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}">
          <div>${actor.name}</div>
        `;
        div.onclick = () => showActorModal(actor.id);
        actorsCarousel.appendChild(div);
      });
    });
}

function showActorModal(actorId) {
  fetch(`https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}&language=fr-FR`)
    .then(res => res.json())
    .then(actor => {
      actorName.textContent = actor.name;
      actorBio.textContent = actor.biography || "Biographie non disponible.";
    });

  fetch(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}&language=fr-FR`)
    .then(res => res.json())
    .then(data => {
      actorMovies.innerHTML = "";
      data.cast.slice(0, 8).forEach(film => {
        if (film.poster_path) {
          const img = document.createElement("img");
          img.src = `https://image.tmdb.org/t/p/w200${film.poster_path}`;
          img.alt = film.title;
          img.className = "actor-movie-poster";
          img.onclick = () => window.location.href = `film.html?id=${film.id}`;
          actorMovies.appendChild(img);
        }
      });
    });

  const modal = new bootstrap.Modal(document.getElementById("actorModal"));
  modal.show();
}

// Fonction d'ajout aux favoris
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
