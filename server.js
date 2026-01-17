import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// debug route (optional but helpful)
app.get("/debug", (req, res) => {
  res.json({
    tmdbKeyLoaded: !!TMDB_KEY
  });
});

// popular movies
app.get("/api/popular", async (req, res) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
    );
    res.json(await r.json());
  } catch (err) {
    res.status(500).json({ error: "TMDB fetch failed" });
  }
});

// search movies
app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
    );
    res.json(await r.json());
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// fallback to frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log("Aurababy Media running on port", PORT);
});
