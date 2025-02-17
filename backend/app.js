import express from "express";
import {
  getActors,
  getActor,
  createActor,
  getTop5RentedFilms,
  getFilmFromTitle,
  getFilmFromId,
  getTop5Actors,
  getActorFilmCount,
  getTop5FilmsFromActor,
  fuzzySearchFilmsWithTitle,
  fuzzySearchFilmsWithActor,
  fuzzySearchFilmsWithGenre,
  getCustomers,
  getRentalCountFromFilmID,
  getRentalCountFromFilmTitle,
} from "./database.js";
import cors from "cors";

const app = express();

// cors needed for different origins (between frontend and backend)
app.use(cors());
// parse json body for post requests.
app.use(express.json());

/* ---------- FILMS ----------- */

app.get("/films/top5", async (req, res) => {
  const films = await getTop5RentedFilms();
  res.send(films);
});

app.get("/films/rental_count/id/:id", async (req, res) => {
  const id = req.params.id;
  const film = await getRentalCountFromFilmID(id);
  res.send(film);
});
app.get("/films/rental_count/title/:title", async (req, res) => {
  const title = req.params.title;
  const film = await getRentalCountFromFilmTitle(title);
  res.send(film);
});

app.get("/films/id/:id", async (req, res) => {
  const id = req.params.id;
  const film = await getFilmFromId(id);
  res.send(film);
});
// why can we get with both title and id? bceause i dont know how to get id from top 5. ( it is grouped by title)
app.get("/films/title/:title", async (req, res) => {
  const title = req.params.title;
  const film = await getFilmFromTitle(title);
  res.send(film);
});

app.get("/films/search/title/:title", async (req, res) => {
  const title = req.params.title;
  const films = await fuzzySearchFilmsWithTitle(title);
  res.send(films);
});
app.get("/films/search/actor/:actor", async (req, res) => {
  const actor = req.params.actor;
  const films = await fuzzySearchFilmsWithActor(actor);
  res.send(films);
});
app.get("/films/search/genre/:genre", async (req, res) => {
  const genre = req.params.genre;
  const films = await fuzzySearchFilmsWithGenre(genre);
  res.send(films);
});

/* ---------- ACTORS ---------- */
app.get("/actors", async (req, res) => {
  // actors will be JSON
  const actors = await getActors();
  res.send(actors);
});

app.get("/actors/film_count/id/:id", async (req, res) => {
  const id = req.params.id;
  const film_count = await getActorFilmCount(id);
  res.send(film_count);
});

app.get("/actors/id/:id", async (req, res) => {
  const id = req.params.id;
  const actor = await getActor(id);
  res.send(actor);
});

app.get("/actors/top5", async (req, res) => {
  const actors = await getTop5Actors();
  res.send(actors);
});

app.get("/actors/top5films/id/:id", async (req, res) => {
  const id = req.params.id;
  const films = await getTop5FilmsFromActor(id);
  res.send(films);
});

app.post("/actors", async (req, res) => {
  const { first_name, last_name } = req.body;
  const actor = createActor(first_name, last_name);
  res.status(201).send(actor);
});

/* ----------- CUSTOMERS ----------- */

app.get("/customers", async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});

// error middleware
// https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Womp womp... something broke...");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
