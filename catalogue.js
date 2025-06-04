const API_KEY = "aac46808dee81ba0b36f3177518f3a48";
const catalogueContainer = document.getElementById("catalogueContainer");
const genreSelect = document.getElementById("genre");
const yearInput = document.getElementById("year");
const sortSelect = document.getElementById("sort");
const filterButton = document.querySelector(".btn-info");
const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestions");

function loadCatalogue(genre = "", year = "", sort = "popularity.desc") {
  catalogueContainer.innerHTML = "";
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr-FR&sort_by=${sort}`;

  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results.length) {
        catalogueContainer.innerHTML = "<p class='text-center'>Aucun film trouvé.</p>";
        return;
      }
      data.results.forEach(movie => {
        if (movie.poster_path) {
          const col = document.createElement("div");
          col.className = "col-md-3 mb-4";
          col.innerHTML = `
            <div class="movie-card" onclick="window.location.href='film.html?id=${movie.id}'">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
              <div class="movie-info">
                <h5>${movie.title}</h5>
                <small>${movie.release_date} &nbsp; ⭐ ${movie.vote_average}</small>
              </div>
            </div>
          `;
          catalogueContainer.appendChild(col);
        }
      });
    })
    .catch(err => {
      console.error("Erreur API :", err);
      catalogueContainer.innerHTML = "<p class='text-center text-danger'>Erreur de chargement des films.</p>";
    });
}

// Initialisation au chargement
loadCatalogue();

// Appliquer les filtres
filterButton.addEventListener("click", () => {
  const genre = genreSelect.value;
  const year = yearInput.value;
  const sort = sortSelect.value;
  loadCatalogue(genre, year, sort);
});

// 🔍 Suggestions dynamiques
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  suggestionsList.innerHTML = "";

  if (query.length < 3) return;

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=fr-FR&query=${query}`)
    .then(res => res.json())
    .then(data => {
      data.results.slice(0, 6).forEach(movie => {
        const item = document.createElement("li");
        item.className = "list-group-item list-group-item-action";
        item.textContent = movie.title;
        item.onclick = () => {
          window.location.href = `film.html?id=${movie.id}`;
        };
        suggestionsList.appendChild(item);
      });
    });
});

// Cacher les suggestions en cliquant ailleurs
window.addEventListener("click", e => {
  if (!searchInput.contains(e.target)) suggestionsList.innerHTML = "";
});
