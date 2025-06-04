const API_KEY = "aac46808dee81ba0b36f3177518f3a48";
const favoritesByGenreContainer = document.getElementById("favoritesByGenre");

function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(movie => movie.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

async function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    favoritesByGenreContainer.innerHTML = "<p class='text-center'>Aucun film en favori.</p>";
    return;
  }

  favoritesByGenreContainer.innerHTML = "<div class='row'></div>";
  const row = favoritesByGenreContainer.querySelector(".row");

  for (const movie of favorites) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=fr-FR`);
      const data = await res.json();

      const col = document.createElement("div");
      col.className = "col-md-3 mb-4";
      col.innerHTML = `
        <div class="movie-card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}">
          <div class="movie-info">
            <h5>${movie.title}</h5>
            <small>${data.release_date || ''} &nbsp; ⭐ ${data.vote_average || ''}</small>
          </div>
          <div class="mt-2 d-flex justify-content-between px-2 pb-2">
            <button class="btn btn-sm btn-danger" onclick="removeFromFavorites(${movie.id})">Retirer</button>
            <button class="btn btn-sm btn-info" onclick="window.location.href='film.html?id=${movie.id}'">Détails</button>
          </div>
        </div>
      `;
      row.appendChild(col);
    } catch (error) {
      console.error("Erreur lors du chargement du film :", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadFavorites);
