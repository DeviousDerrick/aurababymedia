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

/* ---------- API ROUTES ---------- */

// Popular movies
app.get("/api/popular", async (req, res) => {
  const r = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`);
  res.json(await r.json());
});

// Search movies
app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  const r = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`);
  res.json(await r.json());
});

// Popular shows
app.get("/api/popular-shows", async (req, res) => {
  const r = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_KEY}`);
  res.json(await r.json());
});

// Search shows
app.get("/api/search-shows", async (req, res) => {
  const q = req.query.q || "";
  const r = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`);
  res.json(await r.json());
});

// Movie details
app.get("/api/movie/:id", async (req, res) => {
  const r = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${TMDB_KEY}`);
  res.json(await r.json());
});

// Show / anime details
app.get("/api/show/:id", async (req, res) => {
  const r = await fetch(`https://api.themoviedb.org/3/tv/${req.params.id}?api_key=${TMDB_KEY}`);
  res.json(await r.json());
});

/* ---------- FALLBACK (ALWAYS LAST) ---------- */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log("Aurababy Media running on port", PORT));
