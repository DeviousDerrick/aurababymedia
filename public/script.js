const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const moviesContainer = document.getElementById("movies");
const showsContainer = document.getElementById("shows");

const playerContainer = document.getElementById("playerContainer");

// Tabs
const moviesTab = document.getElementById("moviesTab");
const showsTab = document.getElementById("showsTab");

let activeTab = "movies";

moviesTab.onclick = () => {
  activeTab = "movies";
  moviesTab.classList.add("active");
  showsTab.classList.remove("active");
};
showsTab.onclick = () => {
  activeTab = "shows";
  showsTab.classList.add("active");
  moviesTab.classList.remove("active");
};

// Helper: load player
function showPlayer(id, type) {
  playerContainer.innerHTML = "";
  let src = "";
  if (type === "movie") {
    src = `https://vidfast.pro/movie/${id}?autoPlay=true`;
  } else if (type === "show") {
    src = `https://vidfast.pro/tv/${id}/1/1?autoPlay=true`;
  }

  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.allowFullscreen = true;
  playerContainer.appendChild(iframe);
}

// Fetch content
async function fetchContent(query = "") {
  moviesContainer.textContent = "Loading...";
  showsContainer.textContent = "Loading...";

  try {
    // Movies
    let moviesUrl = query ? `/api/search?q=${encodeURIComponent(query)}` : `/api/popular`;
    const moviesRes = await fetch(moviesUrl);
    const moviesData = await moviesRes.json();
    moviesContainer.innerHTML = "";
    if (moviesData.results && moviesData.results.length > 0) {
      moviesData.results.forEach(m => {
        if (!m.poster_path) return;
        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w300${m.poster_path}">
          <h3>${m.title}</h3>
          <button class="playBtn">Play</button>
        `;
        div.querySelector(".playBtn").onclick = e => {
          e.stopPropagation();
          showPlayer(m.id, "movie");
        };
        div.onclick = () => window.location.href = `/movie.html?id=${m.id}&type=movie`;
        moviesContainer.appendChild(div);
      });
    } else {
      moviesContainer.textContent = "No movies found.";
    }

    // Shows
    let showsUrl = query ? `/api/search?q=${encodeURIComponent(query)}` : `/api/popular-shows`;
    const showsRes = await fetch(showsUrl);
    const showsData = await showsRes.json();
    showsContainer.innerHTML = "";
    if (showsData.results && showsData.results.length > 0) {
      showsData.results.forEach(s => {
        if (!s.poster_path) return;
        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w300${s.poster_path}">
          <h3>${s.name}</h3>
          <button class="playBtn">Play</button>
        `;
        div.querySelector(".playBtn").onclick = e => {
          e.stopPropagation();
          showPlayer(s.id, "show");
        };
        div.onclick = () => window.location.href = `/movie.html?id=${s.id}&type=show`;
        showsContainer.appendChild(div);
      });
    } else {
      showsContainer.textContent = "No shows found.";
    }

  } catch (err) {
    moviesContainer.textContent = "Failed to load movies.";
    showsContainer.textContent = "Failed to load shows.";
    console.error(err);
  }
}

// Initial load
fetchContent();

// Search
searchBtn.onclick = () => fetchContent(searchInput.value.trim());
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchContent(searchInput.value.trim());
});
