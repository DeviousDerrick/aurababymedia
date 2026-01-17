const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Add player container dynamically if it doesn't exist
let playerContainer = document.getElementById("playerContainer");
if (!playerContainer) {
  playerContainer = document.createElement("div");
  playerContainer.id = "playerContainer";
  playerContainer.style.width = "100%";
  playerContainer.style.maxWidth = "900px";
  playerContainer.style.margin = "40px auto";
  document.body.appendChild(playerContainer);
}

async function fetchMovies(query = "") {
  moviesContainer.textContent = "Loading popular movies...";

  try {
    const url = query
      ? `/api/search?q=${encodeURIComponent(query)}`
      : `/api/popular`;

    const res = await fetch(url);
    const data = await res.json();

    moviesContainer.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      moviesContainer.textContent = "No results found.";
      return;
    }

    data.results.forEach(movie => {
      if (!movie.poster_path) return;

      const div = document.createElement("div");
      div.className = "movie";

      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
        <h3>${movie.title}</h3>
        <button class="playBtn">Play</button>
      `;

      // Click → Details page (optional)
      div.onclick = () => {
        window.location.href = `/movie.html?id=${movie.id}&type=movie`;
      };

      // Play button click → load VidFast iframe
      const playBtn = div.querySelector(".playBtn");
      playBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent tile click

        const vidfastSrc = `https://vidfast.pro/movie/${movie.id}?autoPlay=true`;

        // Clear previous content
        playerContainer.innerHTML = "";

        // Add close button
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close Player";
        closeBtn.style.marginBottom = "10px";
        closeBtn.style.padding = "10px 20px";
        closeBtn.style.fontSize = "16px";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => (playerContainer.innerHTML = "");
        playerContainer.appendChild(closeBtn);

        // Add iframe
        const iframe = document.createElement("iframe");
        iframe.src = vidfastSrc;
        iframe.width = "100%";
        iframe.height = "600px";
        iframe.frameBorder = 0;
        iframe.allowFullscreen = true;

        playerContainer.appendChild(iframe);

        // Scroll to player smoothly
        iframe.scrollIntoView({ behavior: "smooth" });
      };

      moviesContainer.appendChild(div);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load movies.";
    console.error(err);
  }
}

// Initial load
fetchMovies();

// Search
searchBtn.onclick = () => {
  fetchMovies(searchInput.value.trim());
};

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    fetchMovies(searchInput.value.trim());
  }
});
