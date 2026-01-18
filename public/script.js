// ================= CONFIG =================
const PROXY = "https://aurababy-proxy2.onrender.com/";
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

// ⚠️ ONLY USE THIS IF YOU ARE NOT PROXYING TMDB THROUGH BACKEND
// const TMDB_API_KEY = "YOUR_KEY_HERE";

// ================= HELPERS =================
function qs(id) {
  return document.getElementById(id);
}

function proxify(url) {
  return PROXY + encodeURIComponent(url);
}

function clearPlayer() {
  qs("playerContainer").innerHTML = "";
}

// ================= PLAYER =================
function playYouTube(videoId) {
  qs("playerContainer").innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      allow="autoplay; fullscreen"
      allowfullscreen
    ></iframe>
  `;
}

// ================= GET TRAILER =================
async function getTrailer(type, id) {
  const res = await fetch(
    `${TMDB_BASE}/${type}/${id}/videos?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();

  const trailer = data.results.find(
    v => v.site === "YouTube" && v.type === "Trailer"
  );

  if (!trailer) {
    alert("No trailer available");
    return;
  }

  playYouTube(trailer.key);
}

// ================= MOVIES =================
async function loadMovies() {
  const res = await fetch(
    `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();

  qs("movies").innerHTML = "";

  data.results.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG + movie.poster_path}">
      <p>${movie.title}</p>
      <button class="playBtn">Watch Trailer</button>
    `;

    div.querySelector("button").onclick = () => {
      getTrailer("movie", movie.id);
    };

    qs("movies").appendChild(div);
  });
}

// ================= SHOWS =================
async function loadShows() {
  const res = await fetch(
    `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();

  qs("shows").innerHTML = "";

  data.results.forEach(show => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG + show.poster_path}">
      <p>${show.name}</p>
      <button class="playBtn">View Seasons</button>
    `;

    div.querySelector("button").onclick = () => {
      loadSeasons(show.id);
    };

    qs("shows").appendChild(div);
  });
}

// ================= SEASONS =================
async function loadSeasons(showId) {
  clearPlayer();

  const res = await fetch(
    `${TMDB_BASE}/tv/${showId}?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();

  qs("seasonContainer").innerHTML = "<h3>Seasons</h3>";
  qs("episodeContainer").innerHTML = "";

  data.seasons.forEach(season => {
    if (season.season_number === 0) return;

    const btn = document.createElement("button");
    btn.textContent = `Season ${season.season_number}`;
    btn.onclick = () =>
      loadEpisodes(showId, season.season_number);

    qs("seasonContainer").appendChild(btn);
  });
}

// ================= EPISODES =================
async function loadEpisodes(showId, seasonNum) {
  const res = await fetch(
    `${TMDB_BASE}/tv/${showId}/season/${seasonNum}?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();

  qs("episodeContainer").innerHTML = "<h3>Episodes</h3>";

  data.episodes.forEach(ep => {
    const btn = document.createElement("button");
    btn.textContent = `E${ep.episode_number} – Trailer`;
    btn.onclick = () => {
      getTrailer("tv", showId);
    };
    qs("episodeContainer").appendChild(btn);
  });
}

// ================= SEARCH =================
qs("searchBtn").onclick = async () => {
  const q = qs("searchInput").value.trim();
  if (!q) return;

  qs("movies").innerHTML = "";
  qs("shows").innerHTML = "";

  const movieRes = await fetch(
    `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`
  );
  const showRes = await fetch(
    `${TMDB_BASE}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`
  );

  const movies = await movieRes.json();
  const shows = await showRes.json();

  movies.results.forEach(m => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG + m.poster_path}">
      <p>${m.title}</p>
      <button class="playBtn">Trailer</button>
    `;
    div.querySelector("button").onclick = () =>
      getTrailer("movie", m.id);

    qs("movies").appendChild(div);
  });

  shows.results.forEach(s => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG + s.poster_path}">
      <p>${s.name}</p>
      <button class="playBtn">Seasons</button>
    `;
    div.querySelector("button").onclick = () =>
      loadSeasons(s.id);

    qs("shows").appendChild(div);
  });
};

// ================= INIT =================
loadMovies();
loadShows();
