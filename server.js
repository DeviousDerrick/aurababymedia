import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// required for Render
app.get("/", (req, res) => {
  res.send("TMDB proxy is running");
});

app.get("/popular", async (req, res) => {
  const r = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
  );
  res.json(await r.json());
});

app.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const r = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
  );
  res.json(await r.json());
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
