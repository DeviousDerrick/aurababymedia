const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Fetch movies from backend
async function fetchMovies(query = "") {
  moviesContainer.innerHTML = "Loading movies...";
  try {
    const endpoint = query
      ? `/api/search?q=${encodeURIComponent(query)}`
      : "/api/popular";

    const res = await fetch(endpoint);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      moviesContainer.textContent = "No movies found.";
      return;
    }

    moviesContainer.innerHTML = "";

    data.results.forEach(movie => {
      if (!movie.poster_path) return;

      const div = document.createElement("div");
      div.className = "movie";
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
      `;
      moviesContainer.appendChild(div);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load movies.";
    console.error(err);
  }
}

// Initial load: popular movies
fetchMovies();

// Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  fetchMovies(query);
});

// Allow pressing Enter to search
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    fetchMovies(query);
  }
});
