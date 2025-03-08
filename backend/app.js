// service layer and controller layer in the same file
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
  fuzzySearchCustomerById,
  fuzzySearchCustomerByFirstName,
  fuzzySearchCustomerByLastName,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  getAllFilms,
  getAvailableInventoryCount,
  rentFilm,
  getCustomerRentals,
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

app.get("/films", async (req, res) => {
  const films = await getAllFilms();
  res.send(films);
});

app.get("/films/inventory/:id", async (req, res) => {
  const id = req.params.id;
  const inventory = await getAvailableInventoryCount(id);
  res.send(inventory);
});

app.post("/films/:id/rent", async (req, res) => {
  try {
    const film_id = req.params.id;
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).send("Customer ID is required");
    }

    const result = await rentFilm(customer_id, film_id);
    res.status(201).send(result);
  } catch (error) {
    console.error('Error renting film:', error);
    if (error.message === 'No available copies') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Error processing rental');
    }
  }
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

app.get("/customers/id/:id", async (req, res) => {
  const id = req.params.id;
  const customers = await fuzzySearchCustomerById(id);
  res.send(customers);
});

app.get("/customers/first/:first", async (req, res) => {
  const first = req.params.first;
  const customers = await fuzzySearchCustomerByFirstName(first);
  res.send(customers);
});
app.get("/customers/last/:last", async (req, res) => {
  const last = req.params.last;
  const customers = await fuzzySearchCustomerByLastName(last);
  res.send(customers);
});
app.post("/customers", async (req, res) => {
  let { first_name, last_name, email } = req.body;
  console.log(req.body);

  /*
   in JPA, this logic would be in the service layer
   */
  if (!first_name || !last_name || !email) {
    return res.status(400).send("Missing required fields");
  }
  // follow same format as the rest of the database
  first_name = first_name.toUpperCase();
  last_name = last_name.toUpperCase();

  const customer = addCustomer(first_name, last_name, email);
  res.status(201).send(customer);
});
app.delete("/customers/:id", async (req, res) => {
  console.log("deleting customer");
  const id = req.params.id;
  const customer = await deleteCustomer(id);
  res.send(customer);
});

app.put("/customers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let { first_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).send("Missing required fields");
    }

    // follow same format as the rest of the database
    first_name = first_name.toUpperCase();
    last_name = last_name.toUpperCase();

    const customer = await updateCustomer(id, first_name, last_name, email);
    res.send(customer);
  } catch (error) {
    if (error.message === 'Customer not found') {
      res.status(404).send(error.message);
    } else {
      console.error('Error updating customer:', error);
      res.status(500).send('Error updating customer');
    }
  }
});

app.get("/customers/:id/rentals", async (req, res) => {
  try {
    const id = req.params.id;
    const rentals = await getCustomerRentals(id);
    res.send(rentals);
  } catch (error) {
    console.error('Error getting customer rentals:', error);
    res.status(500).send('Error getting customer rentals');
  }
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
