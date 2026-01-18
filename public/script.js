const CINEMAOS_BASE = "https://cinemaos.tech/player/";
const $ = id => document.getElementById(id);
const PROXY = "https://aurababy-proxy2.onrender.com/scramjet/";

// Redirect to media.html with proxy
function playIframe(url, isTV=false, showId=null) {
  const params = new URLSearchParams();
  params.set("src", url);
  if (isTV && showId) {
    params.set("tv", "1");
    params.set("id", showId);
  }
  window.location.href = `media.html?${params.toString()}`;
}

// ================= MOVIES =================
async function loadMovies(query="") {
  const moviesDiv = $("movies");
  moviesDiv.textContent = "Loading movies...";
  const url = query ? `/api/search?q=${encodeURIComponent(query)}` : `/api/popular`;
  const res = await fetch(url);
  const data = await res.json();
  moviesDiv.innerHTML = "";
  data.results?.forEach(movie => {
    if (!movie.poster_path) return;
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
      <p>${movie.title}</p>
      <button class="playBtn">Play</button>
    `;
    div.querySelector("button").onclick = () => {
      const movieUrl = `${CINEMAOS_BASE}movie/${movie.id}`;
      playIframe(movieUrl);
    };
    moviesDiv.appendChild(div);
  });
}

// ================= SHOWS =================
async function loadShows(query="") {
  const showsDiv = $("shows");
  showsDiv.textContent = "Loading shows...";
  const url = query ? `/api/search-shows?q=${encodeURIComponent(query)}` : `/api/popular-shows`;
  const res = await fetch(url);
  const data = await res.json();
  showsDiv.innerHTML = "";
  data.results?.forEach(show => {
    if (!show.poster_path) return;
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${show.poster_path}">
      <p>${show.name}</p>
      <button class="playBtn">Watch</button>
    `;
    div.querySelector("button").onclick = () => {
      const defaultEpisode = `${CINEMAOS_BASE}tv/${show.id}/1/1`;
      playIframe(defaultEpisode, true, show.id);
    };
    showsDiv.appendChild(div);
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
