const moviesContainer = document.getElementById("movies");
const showsContainer = document.getElementById("shows");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const playerBox = document.getElementById("playerBox");

function showPlayer(id, type) {
  playerBox.innerHTML = `
    <iframe
      src="https://vidfast.net/embed/${type}/${id}"
      allowfullscreen
      referrerpolicy="no-referrer"
    ></iframe>
  `;
  playerBox.scrollIntoView({ behavior: "smooth" });
}

function createTile(item, type) {
  const div = document.createElement("div");
  div.className = "movie";

  const title = item.title || item.name || "Untitled";
  const poster = item.poster_path;

  if (!poster) return null;

  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w300${poster}">
    <h3>${title}</h3>
    <button class="playBtn">Play</button>
  `;

  div.querySelector(".playBtn").onclick = e => {
    e.stopPropagation();
    showPlayer(item.id, type);
  };

  div.onclick = () => {
    window.location.href = `/movie.html?id=${item.id}&type=${type}`;
  };

  return div;
}

// ---------- LOAD POPULAR ----------
async function loadPopular() {
  moviesContainer.textContent = "Loading movies...";
  showsContainer.textContent = "Loading shows...";

  try {
    const [moviesRes, showsRes] = await Promise.all([
      fetch("/api/popular"),
      fetch("/api/popular-shows"),
    ]);

    const movies = await moviesRes.json();
    const shows = await showsRes.json();

    moviesContainer.innerHTML = "";
    showsContainer.innerHTML = "";

    movies.results.forEach(m => {
      const tile = createTile(m, "movie");
      if (tile) moviesContainer.appendChild(tile);
    });

    shows.results.forEach(s => {
      const tile = createTile(s, "show");
      if (tile) showsContainer.appendChild(tile);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load movies.";
    showsContainer.textContent = "Failed to load shows.";
    console.error(err);
  }
}

// ---------- SEARCH ----------
async function searchAll(query) {
  moviesContainer.textContent = "Searching...";
  showsContainer.textContent = "Searching...";

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    moviesContainer.innerHTML = "";
    showsContainer.innerHTML = "";

    if (!data.results || !data.results.length) {
      moviesContainer.textContent = "No results.";
      showsContainer.textContent = "";
      return;
    }

    data.results.forEach(item => {
      if (item.media_type === "movie") {
        const tile = createTile(item, "movie");
        if (tile) moviesContainer.appendChild(tile);
      }

      if (item.media_type === "tv") {
        const tile = createTile(item, "show");
        if (tile) showsContainer.appendChild(tile);
      }
    });

  } catch (err) {
    moviesContainer.textContent = "Search failed.";
    showsContainer.textContent = "";
    console.error(err);
  }
}

// Initial load
loadPopular();

// Search handlers
searchBtn.onclick = () => {
  const q = searchInput.value.trim();
  if (q) searchAll(q);
  else loadPopular();
};

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    searchBtn.onclick();
  }
});
