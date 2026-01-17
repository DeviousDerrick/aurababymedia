const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

if (!id || !type) {
  document.body.innerHTML = "Invalid link";
  throw new Error("Missing ID or type");
}

const endpoint =
  type === "movie"
    ? `/api/movie/${id}`
    : `/api/show/${id}`;

fetch(endpoint)
  .then(res => res.json())
  .then(data => {
    document.getElementById("title").textContent =
      data.title || data.name;

    document.getElementById("overview").textContent =
      data.overview || "No overview available.";

    document.getElementById("rating").textContent =
      data.vote_average || "N/A";

    document.getElementById("date").textContent =
      data.release_date || data.first_air_date || "Unknown";

    document.getElementById("poster").src =
      `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  })
  .catch(err => {
    document.body.innerHTML = "Failed to load details";
    console.error(err);
  });
