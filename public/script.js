const container = document.getElementById("movies");

fetch("/api/popular")
  .then(res => res.json())
  .then(data => {
    container.innerHTML = "";

    data.results.forEach(movie => {
      const div = document.createElement("div");
      div.className = "movie";
      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}">
        <h3>${movie.title}</h3>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    container.textContent = "Failed to load movies";
    console.error(err);
  });
