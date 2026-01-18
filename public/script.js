// ================= CONFIG =================
const CINEMAOS_BASE = "https://cinemaos.tech/player/"; // CinemaOS base URL
const IMG = "https://image.tmdb.org/t/p/w500";

// ================= HELPERS =================
const $ = id => document.getElementById(id);

// Redirect to media.html with CinemaOS URL
function playIframe(url) {
  const fullUrl = `${url}`;
  window.location.href = `media.html?src=${encodeURIComponent(fullUrl)}`;
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
      // CinemaOS link for movie
      const movieUrl = `${CINEMAOS_BASE}movie/${movie.id}`;
      playIframe(movieUrl);
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
      <div class="seasons" id="seasons-${show.id}"></div>
    `;

    div.querySelector("button").onclick = async () => {
      // Play first episode by default
      const defaultUrl = `${CINEMAOS_BASE}tv/${show.id}/1/1`;
      playIframe(defaultUrl);
      await loadSeasons(show.id, div.querySelector(`#seasons-${show.id}`));
    };

    showsDiv.appendChild(div);
  });
}

// ================= LOAD SEASONS =================
async function loadSeasons(showId, container) {
  container.innerHTML = "Loading seasons...";

  const res = await fetch(`/api/show/${showId}`);
  const data = await res.json();

  container.innerHTML = "";

  data.seasons?.forEach(season => {
    if (season.season_number === 0) return;

    const seasonBtn = document.createElement("button");
    seasonBtn.textContent = `Season ${season.season_number}`;
    seasonBtn.style.marginRight = "5px";

    seasonBtn.onclick = () => loadEpisodes(showId, season.season_number, container);

    container.appendChild(seasonBtn);
  });

  // Auto-load first season episodes
  loadEpisodes(showId, 1, container);
}

// ================= LOAD EPISODES =================
async function loadEpisodes(showId, seasonNum, container) {
  // Create episode container
  let episodeContainer = container.querySelector(".episodes");
  if (!episodeContainer) {
    episodeContainer = document.createElement("div");
    episodeContainer.className = "episodes";
    episodeContainer.style.marginTop = "5px";
    container.appendChild(episodeContainer);
  }
  episodeContainer.innerHTML = "";

  const res = await fetch(`/api/show/${showId}/season/${seasonNum}`);
  const data = await res.json();

  data.episodes?.forEach(ep => {
    const epBtn = document.createElement("button");
    epBtn.textContent = `E${ep.episode_number}: ${ep.name}`;
    epBtn.style.display = "block";
    epBtn.style.marginTop = "2px";
    epBtn.style.fontSize = "12px";

    epBtn.onclick = () => {
      const episodeUrl = `${CINEMAOS_BASE}tv/${showId}/${seasonNum}/${ep.episode_number}`;
      playIframe(episodeUrl);
    };

    episodeContainer.appendChild(epBtn);
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
