const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Type selector (default: movies)
let contentType = "movie";

// Optional: create tabs at the top
const header = document.querySelector("header");
const tabContainer = document.createElement("div");
tabContainer.style.marginLeft = "20px";
tabContainer.innerHTML = `
  <button id="moviesTab">Movies</button>
  <button id="showsTab">Shows</button>
`;
header.appendChild(tabContainer);

document.getElementById("moviesTab").onclick = () => {
  contentType = "movie";
  fetchContent();
};
document.getElementById("showsTab").onclick = () => {
  contentType = "show";
  fetchContent();
};

// Player container
const playerContainer = document.getElementById("playerContainer");

// Function to show player in the big box
function showPlayer(contentId, type) {
  playerContainer.innerHTML = "";

  const vidfastSrc =
    type === "movie"
      ? `https://vidfast.pro/movie/${contentId}?autoPlay=true`
      : `https://vidfast.pro/tv/${contentId}/1/1?autoPlay=true`;

  const iframe = document.createElement("iframe");
  iframe.src = vidfastSrc;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = 0;
  iframe.allowFullscreen = true;

  playerContainer.appendChild(iframe);
}

// Fetch content (movies or shows)
async function fetchContent(query = "") {
  moviesContainer.textContent = "Loading...";

  try {
    let url = "";
    if (query) {
      url = `/api/search?q=${encodeURIComponent(query)}`;
    } else {
      if (contentType === "movie") url = `/api/popular`;
      else if (contentType === "show") url = `/api/popular-shows`;
    }

    const res = await fetch(url);
    const data = await res.json();

    moviesContainer.innerHTML = "";
    if (!data.results || data.results.length === 0) {
      moviesContainer.textContent = "No results found.";
      return;
    }

    data.results.forEach(item => {
      if (!item.poster_path) return;

      const div = document.createElement("div");
      div.className = "movie";

      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${item.poster_path}">
        <h3>${item.title || item.name}</h3>
        <button class="playBtn">Play</button>
      `;

      // Details page click
      div.onclick = () => {
        window.location.href = `/movie.html?id=${item.id}&type=${contentType}`;
      };

      // Play button
      div.querySelector(".playBtn").onclick = (e) => {
        e.stopPropagation();
        showPlayer(item.id, contentType);
      };

      moviesContainer.appendChild(div);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load content.";
    console.error(err);
  }
}

// Initial load
fetchContent();

// Search button
searchBtn.onclick = () => fetchContent(searchInput.value.trim());

// Enter key search
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchContent(searchInput.value.trim());
});
