const moviesContainer = document.getElementById("movies");
const showsContainer = document.getElementById("shows");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const seasonContainer = document.getElementById("seasonContainer");
const episodeContainer = document.getElementById("episodeContainer");
const playerContainer = document.getElementById("playerContainer");

/* ---------- PLAYER FUNCTIONS ---------- */
function playMovie(movieId) {
  playerContainer.innerHTML = `
    <iframe src="https://aurababy-proxy2.onrender.com/embed/movie/${movieId}" 
            width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>
  `;
}

async function loadShow(showId, season = 1, episode = 1) {
  // Load iframe for selected season/episode
  playerContainer.innerHTML = `
    <iframe src="https://aurababy-proxy2.onrender.com/embed/show/${showId}/${season}/${episode}" 
            width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>
  `;

  // Fetch show details from TMDB
  const res = await fetch(`/api/show/${showId}`);
  const data = await res.json();

  // Populate seasons
  seasonContainer.innerHTML = "<p>Seasons</p>";
  data.seasons.forEach(s => {
    if (!s.season_number) return;
    const btn = document.createElement("button");
    btn.textContent = `Season ${s.season_number}`;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.onclick = () => loadEpisodes(showId, s.season_number);
    seasonContainer.appendChild(btn);
  });

  // Load episodes for the selected season by default
  loadEpisodes(showId, season);
}

async function loadEpisodes(showId, seasonNumber) {
  // Fetch episodes for the season
  const res = await fetch(`/api/show/${showId}/season/${seasonNumber}`);
  const data = await res.json();

  episodeContainer.innerHTML = "<p>Episodes</p>";
  data.episodes.forEach(e => {
    const btn = document.createElement("button");
    btn.textContent = `Ep ${e.episode_number}: ${e.name}`;
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.onclick = () => loadShow(showId, seasonNumber, e.episode_number);
    episodeContainer.appendChild(btn);
  });
}

/* ---------- FETCH MOVIES & SHOWS ---------- */
async function fetchAll(query = "") {
  moviesContainer.textContent = "Loading movies...";
  showsContainer.textContent = "Loading shows...";

  try {
    // Movies
    const movieURL = query
      ? `/api/search?q=${encodeURIComponent(query)}`
      : `/api/popular`;

    // Shows
    const showURL = query
      ? `/api/search-shows?q=${encodeURIComponent(query)}`
      : `/api/popular-shows`;

    // Fetch data
    const [movieRes, showRes] = await Promise.all([
      fetch(movieURL),
      fetch(showURL),
    ]);

    const movieData = await movieRes.json();
    const showData = await showRes.json();

    moviesContainer.innerHTML = "";
    showsContainer.innerHTML = "";

    // Populate movies
    movieData.results?.forEach(movie => {
      if (!movie.poster_path) return;

      const div = document.createElement("div");
      div.className = "movie";
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
        <h3>${movie.title}</h3>
        <button class="playBtn">Play</button>
      `;

      div.querySelector(".playBtn").onclick = e => {
        e.stopPropagation();
        playMovie(movie.id);
      };

      moviesContainer.appendChild(div);
    });

    // Populate shows
    showData.results?.forEach(show => {
      if (!show.poster_path) return;

      const div = document.createElement("div");
      div.className = "movie";
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${show.poster_path}">
        <h3>${show.name}</h3>
        <button class="playBtn">Play</button>
      `;

      div.querySelector(".playBtn").onclick = e => {
        e.stopPropagation();
        loadShow(show.id); // Default season 1, episode 1
      };

      showsContainer.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    moviesContainer.textContent = "Failed to load movies.";
    showsContainer.textContent = "Failed to load shows.";
  }
}

/* ---------- INIT ---------- */
fetchAll();

searchBtn.onclick = () => fetchAll(searchInput.value.trim());
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchAll(searchInput.value.trim());
});
