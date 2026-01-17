const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

async function fetchMovies(query = "") {
  moviesContainer.textContent = "Loading popular movies...";

  try {
    const url = query
      ? `/api/search?q=${encodeURIComponent(query)}`
      : `/api/popular`;

    const res = await fetch(url);
    const data = await res.json();

    moviesContainer.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      moviesContainer.textContent = "No results found.";
      return;
    }

    data.results.forEach(movie => {
      if (!movie.poster_path) return;

      const div = document.createElement("div");
      div.className = "movie";
      div.innerHTML = `
  <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
  <h3>${movie.title}</h3>
  <button class="playBtn">Play</button>
`;
const playBtn = div.querySelector(".playBtn");
playBtn.onclick = (e) => {
  e.stopPropagation(); // Prevent clicking the tile itself

  const vidfastSrc = `https://vidfast.pro/movie/${movie.id}?autoPlay=true`;

  const iframe = document.createElement("iframe");
  iframe.src = vidfastSrc;
  iframe.width = "100%";
  iframe.height = "600px";
  iframe.frameBorder = 0;
  iframe.allowFullscreen = true;

  const playerContainer = document.getElementById("playerContainer");
  playerContainer.innerHTML = ""; // Clear previous
  playerContainer.appendChild(iframe);

  // Scroll to the player
  iframe.scrollIntoView({ behavior: "smooth" });
};


      // CLICK → DETAILS PAGE
      div.onclick = () => {
        window.location.href = `/movie.html?id=${movie.id}&type=movie`;
      };

      moviesContainer.appendChild(div);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load movies.";
    console.error(err);
  }
}

// Initial load
fetchMovies();

// Search
searchBtn.onclick = () => {
  fetchMovies(searchInput.value.trim());
};

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    fetchMovies(searchInput.value.trim());
  }
});
