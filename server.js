import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_KEY;

// serve frontend
app.use(express.static("public"));

// backend routes
app.get("/api/popular", async (req, res) => {
  const r = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
  );
  res.json(await r.json());
});

app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";
  const r = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
  );
  res.json(await r.json());
});

// fallback (important)
app.get("*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.listen(PORT, () => {
  console.log("Aurababy Media running on port", PORT);
});
