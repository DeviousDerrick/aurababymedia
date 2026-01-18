const moviesContainer = document.getElementById("movies");
const showsContainer = document.getElementById("shows");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const playerContainer = document.getElementById("playerContainer");

/* ---------- PLAYER ---------- */
function playMovie(movieId) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://vidfast.net/movie/${movieId}?autoPlay=true`;
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; fullscreen";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.frameBorder = 0;

  playerContainer.innerHTML = "";
  playerContainer.appendChild(iframe);
  playerContainer.scrollIntoView({ behavior: "smooth" });
}

function playShow(showId, season = 1, episode = 1) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://vidfast.net/tv/${showId}/${season}/${episode}?autoPlay=true`;
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; fullscreen";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.frameBorder = 0;

  playerContainer.innerHTML = "";
  playerContainer.appendChild(iframe);
  playerContainer.scrollIntoView({ behavior: "smooth" });
}

/* ---------- FETCH ---------- */
async function fetchAll(query = "") {
  moviesContainer.textContent = "Loading movies...";
  showsContainer.textContent = "Loading shows...";

  try {
    const movieURL = query
      ? `/api/search?q=${encodeURIComponent(query)}`
      : `/api/popular`;

    const showURL = query
      ? `/api/search-shows?q=${encodeURIComponent(query)}`
      : `/api/popular-shows`;

    const [movieRes, showRes] = await Promise.all([
      fetch(movieURL),
      fetch(showURL)
    ]);

    const movieData = await movieRes.json();
    const showData = await showRes.json();

    moviesContainer.innerHTML = "";
    showsContainer.innerHTML = "";

    /* ---------- Movies ---------- */
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

    /* ---------- Shows ---------- */
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
        playShow(show.id); // default season 1 episode 1
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
