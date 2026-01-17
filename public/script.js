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

async function fetchAll(query = "") {
  moviesContainer.textContent = "Loading movies...";
  showsContainer.textContent = "Loading shows...";

  try {
    const movieUrl = query
      ? `/api/search-movie?q=${encodeURIComponent(query)}`
      : `/api/popular`;

    const showUrl = query
      ? `/api/search-show?q=${encodeURIComponent(query)}`
      : `/api/popular-shows`;

    const [movieRes, showRes] = await Promise.all([
      fetch(movieUrl),
      fetch(showUrl),
    ]);

    const movies = await movieRes.json();
    const shows = await showRes.json();

    // ----- MOVIES -----
    moviesContainer.innerHTML = "";
    if (movies.results && movies.results.length) {
      movies.results.forEach(m => {
        if (!m.poster_path) return;

        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w300${m.poster_path}">
          <h3>${m.title || m.name || "Untitled Movie"}</h3>
          <button class="playBtn">Play</button>
        `;

        div.querySelector(".playBtn").onclick = e => {
          e.stopPropagation();
          showPlayer(m.id, "movie");
        };

        div.onclick = () => {
          window.location.href = `/movie.html?id=${m.id}&type=movie`;
        };

        moviesContainer.appendChild(div);
      });
    } else {
      moviesContainer.textContent = "No movies found.";
    }

    // ----- SHOWS -----
    showsContainer.innerHTML = "";
    if (shows.results && shows.results.length) {
      shows.results.forEach(s => {
        if (!s.poster_path) return;

        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w300${s.poster_path}">
          <h3>${s.name || s.title || "Untitled Show"}</h3>
          <button class="playBtn">Play</button>
        `;

        div.querySelector(".playBtn").onclick = e => {
          e.stopPropagation();
          showPlayer(s.id, "show");
        };

        div.onclick = () => {
          window.location.href = `/movie.html?id=${s.id}&type=show`;
        };

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
fetchAll();

// Search
searchBtn.onclick = () => {
  fetchAll(searchInput.value.trim());
};

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    fetchAll(searchInput.value.trim());
  }
});
