import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// Root route
app.get("/", (req, res) => {
  res.send("TMDB proxy is running");
});

// Popular movies
app.get("/popular", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
    );
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Search movies
app.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
    );
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Debug endpoint to check key
app.get("/debug", (req, res) => {
  res.send({ TMDB_KEY: TMDB_KEY ? "SET" : "NOT SET" });
});

// Catch-all for routing issues
app.get("*", (req, res) => {
  res.send(`You hit: ${req.path}`);
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
