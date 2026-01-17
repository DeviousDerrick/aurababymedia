const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const tabButtons = document.querySelectorAll(".tab-btn");

let currentCategory = "movies"; // default tab

// Map category to backend endpoint
function getEndpoint(category, query = "") {
  switch(category) {
    case "movies":
      return query ? `/api/search?q=${encodeURIComponent(query)}` : "/api/popular";
    case "shows":
      return query ? `/api/search?q=${encodeURIComponent(query)}` : "/api/popular-shows";
    case "anime":
      return query ? `/api/search?q=${encodeURIComponent(query)}` : "/api/popular-anime";
  }
}

// Fetch and display movies/shows/anime
async function fetchContent(query = "") {
  moviesContainer.innerHTML = "Loading...";
  try {
    const res = await fetch(getEndpoint(currentCategory, query));
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      moviesContainer.textContent = "No content found.";
      return;
    }

    moviesContainer.innerHTML = "";

    data.results.forEach(item => {
      const poster = item.poster_path || item.backdrop_path;
      if (!poster) return;

      const div = document.createElement("div");
      div.className = "movie";
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${poster}" alt="${item.title || item.name}">
        <h3>${item.title || item.name}</h3>
      `;
      moviesContainer.appendChild(div);
    });

  } catch (err) {
    moviesContainer.textContent = "Failed to load content.";
    console.error(err);
  }
}

// Initial load: Movies
fetchContent();

// Search button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  fetchContent(query);
});

// Press Enter to search
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    fetchContent(searchInput.value.trim());
  }
});

// Tab switching
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    fetchContent(); // load content for new tab
  });
});
