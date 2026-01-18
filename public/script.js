const moviesContainer = document.getElementById("movies");
const showsContainer = document.getElementById("shows");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const playerContainer = document.getElementById("playerContainer");

const episodeControls = document.getElementById("episodeControls");
const seasonSelect = document.getElementById("seasonSelect");
const episodeSelect = document.getElementById("episodeSelect");
const playEpisodeBtn = document.getElementById("playEpisode");

let currentShowId = null;

/* ---------- PLAYER ---------- */
function playMovie(id) {
  episodeControls.style.display = "none";

  const iframe = document.createElement("iframe");
  iframe.src = `https://vidfast.net/embed/movie/${id}`;
  iframe.allowFullscreen = true;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.frameBorder = 0;

  playerContainer.innerHTML = "";
  playerContainer.appendChild(iframe);
  playerContainer.scrollIntoView({ behavior: "smooth" });
}

function playShowEpisode(showId, season, episode) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://vidfast.net/embed/tv/${showId}/${season}/${episode}`;
  iframe.allowFullscreen = true;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.frameBorder = 0;

  playerContainer.innerHTML = "";
  playerContainer.appendChild(iframe);
}

/* ---------- SEASONS / EPISODES ---------- */
async function loadSeasons(showId) {
  currentShowId = showId;
  episodeControls.style.display = "block";
  seasonSelect.innerHTML = "";
  episodeSelect.innerHTML = "";

  const res = await fetch(`/api/show/${showId}`);
  const data = await res.json();

  data.seasons.forEach(season => {
    if (season.season_number === 0) return; // skip specials
    const opt = document.createElement("option");
    opt.value = season.season_number;
    opt.textContent = `Season ${season.season_number}`;
    seasonSelect.appendChild(opt);
  });

  loadEpisodes(showId, seasonSelect.value);
}

async function loadEpisodes(showId, seasonNum) {
  episodeSelect.innerHTML = "";

  const res = await fetch(`/api/show/${showId}`);
  const data = await res.json();
  const season = data.seasons.find(s => s.season_number == seasonNum);

  for (let i = 1; i <= season.episode_count; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Episode ${i}`;
    episodeSelect.appendChild(opt);
  }
}

seasonSelect.onchange = () => {
  loadEpisodes(currentShowId, seasonSelect.value);
};

playEpisodeBtn.onclick = () => {
  playShowEpisode(
    currentShowId,
    seasonSelect.value,
    episodeSelect.value
  );
};

/* ---------- FETCH CONTENT ---------- */
async function fetchAll(query = "") {
  moviesContainer.innerHTML = "Loading movies...";
  showsContainer.innerHTML = "Loading shows...";

  const movieURL = query
    ? `/api/search?q=${encodeURIComponent(query)}`
    : `/api/popular`;

  const showURL = query
    ? `/api/search-shows?q=${encodeURIComponent(query)}`
    : `/api/popular-shows`;

  const [mRes, sRes] = await Promise.all([
    fetch(movieURL),
    fetch(showURL)
  ]);

  const movies = await mRes.json();
  const shows = await sRes.json();

  moviesContainer.innerHTML = "";
  showsContainer.innerHTML = "";

  movies.results?.forEach(m => {
    if (!m.poster_path) return;
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${m.poster_path}">
      <h3>${m.title}</h3>
      <button class="playBtn">Play</button>
    `;
    div.querySelector("button").onclick = e => {
      e.stopPropagation();
      playMovie(m.id);
    };
    moviesContainer.appendChild(div);
  });

  shows.results?.forEach(s => {
    if (!s.poster_path) return;
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${s.poster_path}">
      <h3>${s.name}</h3>
      <button class="playBtn">Select Episode</button>
    `;
    div.querySelector("button").onclick = e => {
      e.stopPropagation();
      loadSeasons(s.id);
    };
    showsContainer.appendChild(div);
  });
}

/* ---------- INIT ---------- */
fetchAll();
searchBtn.onclick = () => fetchAll(searchInput.value.trim());
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchAll(searchInput.value.trim());
});
