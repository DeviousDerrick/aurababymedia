// ================= CONFIG =================
const CINEMAOS_BASE = "https://cinemaos.tech/player/"; // CinemaOS player base URL
const IMG = "https://image.tmdb.org/t/p/w500";

// ================= HELPERS =================
const $ = id => document.getElementById(id);

// Redirect to media.html with CinemaOS
function playIframe(tmdbId) {
  const cinemaUrl = `${CINEMAOS_BASE}${tmdbId}`;
  window.location.href = `media.html?src=${encodeURIComponent(cinemaUrl)}`;
}

// ================= MOVIES =================
async function loadMovies(query = "") {
  const moviesDiv = $("movies");
  moviesDiv.textContent = "Loading movies...";

  const url = query
    ? `/api/search?q=${encodeURIComponent(query)}`
    : `/api/popular`;

  const res = await fetch(url);
  const data = await res.json();

  moviesDiv.innerHTML = "";

  data.results?.forEach(movie => {
    if (!movie.poster_path) return;

    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG + movie.poster_path}">
      <p>${movie.title}</p>
      <button class="playBtn">Play</button>
    `;

    div.querySelector("button").onclick = () => {
      // Use CinemaOS link
      playIframe(movie.id);
    };

    moviesDiv.appendChild(div);
  });
}

// ================= SHOWS =================
async function loadShows(query = "") {
  const showsDiv = $("shows");
  showsDiv.textContent = "Loading shows...";

  const url = query
    ? `/api/search-shows?q=${encodeURIComponent(query)}`
    : `/api/popular-shows`;

  const res = await fetch(url);
  const data = await res.json();

  showsDiv.innerHTML = "";

  data.results?.forEach(show => {
    if (!show.poster_path) return;

    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG + show.poster_path}">
      <p>${show.name}</p>
      <button class="playBtn">Watch</button>
    `;

    div.querySelector("button").onclick = () => {
      // Play show via CinemaOS (first season/episode)
      playIframe(show.id);
      loadSeasons(show.id);
    };

    showsDiv.appendChild(div);
  });
}

// ================= PLAY SHOW =================
function playShow(showId, season, episode) {
  // CinemaOS currently just uses show ID; can add season/episode if supported
  playIframe(showId);
}

// ================= SEASONS =================
async function loadSeasons(showId) {
  const seasonBox = $("seasonContainer");
  const episodeBox = $("episodeContainer");

  if (!seasonBox || !episodeBox) return;

  seasonBox.innerHTML = "<p>Seasons</p>";
  episodeBox.innerHTML = "<p>Episodes</p>";

  const res = await fetch(`/api/show/${showId}`);
  const data = await res.json();

  data.seasons?.forEach(season => {
    if (season.season_number === 0) return;

    const btn = document.createElement("button");
    btn.textContent = `Season ${season.season_number}`;
    btn.onclick = () => loadEpisodes(showId, season.season_number);

    seasonBox.appendChild(btn);
  });

  loadEpisodes(showId, 1);
}

// ================= EPISODES =================
async function loadEpisodes(showId, seasonNum) {
  const episodeBox = $("episodeContainer");
  if (!episodeBox) return;

  episodeBox.innerHTML = "<p>Episodes</p>";

  const res = await fetch(`/api/show/${showId}/season/${seasonNum}`);
  const data = await res.json();

  data.episodes?.forEach(ep => {
    const btn = document.createElement("button");
    btn.textContent = `E${ep.episode_number}`;
    btn.onclick = () => playShow(showId, seasonNum, ep.episode_number);

    episodeBox.appendChild(btn);
  });
}

// ================= SEARCH =================
$("searchBtn").onclick = () => {
  const q = $("searchInput").value.trim();
  loadMovies(q);
  loadShows(q);
};

$("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = $("searchInput").value.trim();
    loadMovies(q);
    loadShows(q);
  }
});

// ================= INIT =================
loadMovies();
loadShows();
