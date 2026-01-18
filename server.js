import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Debug
app.get("/debug", (req, res) => {
  res.json({ tmdbKeyLoaded: !!TMDB_KEY });
});

/* ---------- API ROUTES (DO NOT MOVE) ---------- */

// Popular movies
app.get("/api/popular", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Search movies
app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Search failed" });
  }
});

// Search shows
app.get("/api/search-shows", async (req, res) => {
  const q = req.query.q || "";
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Search shows failed" });
  }
});


// Popular shows
app.get("/api/popular-shows", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_KEY}`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Failed to fetch shows" });
  }
});

// Popular anime
app.get("/api/popular-anime", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_genres=16&sort_by=popularity.desc`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Failed to fetch anime" });
  }
});

// Movie details
app.get("/api/movie/:id", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${TMDB_KEY}`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Movie details failed" });
  }
});

// Show / anime details
app.get("/api/show/:id", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/tv/${req.params.id}?api_key=${TMDB_KEY}`
    );
    res.json(await r.json());
  } catch {
    res.status(500).json({ error: "Show details failed" });
  }
});

/* ---------- FALLBACK (ALWAYS LAST) ---------- */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Aurababy Media running on port", PORT);
});
