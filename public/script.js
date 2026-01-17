const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Add bottom-fixed player container dynamically
let playerContainer = document.getElementById("playerContainer");
if (!playerContainer) {
  playerContainer = document.createElement("div");
  playerContainer.id = "playerContainer";
  playerContainer.style.position = "fixed";
  playerContainer.style.bottom = "0";
  playerContainer.style.left = "0";
  playerContainer.style.width = "100%";
  playerContainer.style.height = "600px"; // bigger player
  playerContainer.style.background = "#000";
  playerContainer.style.zIndex = "1000";
  playerContainer.style.display = "none"; // hide until play
  playerContainer.style.flexDirection = "column";
  playerContainer.style.alignItems = "center";
  playerContainer.style.justifyContent = "center";
  document.body.appendChild(playerContainer);
}

// Helper to show the player
function showPlayer(contentId, type) {
  playerContainer.innerHTML = "";
  playerContainer.style.display = "flex";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close Player";
  closeBtn.style.margin = "10px";
  closeBtn.style.padding = "10px 20px";
  closeBtn.style.fontSize = "16px";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => {
    playerContainer.style.display = "none";
    playerContainer.innerHTML = "";
  };
  playerContainer.appendChild(closeBtn);

  // Determine VidFast URL based on type
  let vidfastSrc = "";
  if (type === "movie") {
    vidfastSrc = `https://vidfast.pro/movie/${contentId}?autoPlay=true`;
  } else if (type === "show" || type === "anime") {
    vidfastSrc = `https://vidfast.pro/tv/${contentId}/1/1?autoPlay=true`; // default season 1 episode 1
  }

  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = vidfastSrc;
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.frameBorder = 0;
  iframe.allowFullscreen = true;
  playerContainer.appendChild(iframe);
}

// Fetch and display content
async function fetchContent(query = "", type = "movie") {
  moviesContainer.textContent = "Loading...";

  try {
    let url = "";
    if (query) {
      url = `/api/search?q=${encodeURIComponent(query)}`;
    } else {
      if (type === "movie") url = `/api/popular`;
      else if (type === "show") url = `/api/popular-shows`;
      else if (type === "anime") url = `/api/popular-anime`;
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

      // Click → Details page
      div.onclick = () => {
        const typeParam = type === "anime" ? "show" : type;
        window.location.href = `/movie.html?id=${item.id}&type=${typeParam}`;
      };

      // Play button
      const playBtn = div.querySelector(".playBtn");
      playBtn.onclick = (e) => {
        e.stopPropagation();
        const typeParam = type === "anime" ? "anime" : type;
        showPlayer(item.id, typeParam);
      };

      moviesContainer.appendChild(div);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load content.";
    console.error(err);
  }
}

// Initial load (default: movies)
fetchContent();

// Search button
searchBtn.onclick = () => fetchContent(searchInput.value.trim());

// Enter key search
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") fetchContent(searchInput.value.trim());
});
