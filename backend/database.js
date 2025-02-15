import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// collection of connections
/**
Connection pools help reduce the time spent connecting to the MySQL server by reusing a previous connection, 
leaving them open instead of closing when you are done with them.
This improves the latency of queries as you avoid all of the overhead that comes with establishing a new connection.
 */
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();
//  ^we can handle the result of tihs promise
// by either using await or .then callback

export async function getTop5RentedFilms() {
  const [rows] = await pool.query(
    `
    SELECT 
	    film.title,
      COUNT(*) AS rented
    FROM
	    film 
    JOIN 
	    # contains
	    inventory ON film.film_id = inventory.film_id
    JOIN
	    rental ON rental.inventory_id = inventory.inventory_id
    GROUP BY film.title
    ORDER BY rented DESC
    LIMIT 5;
    `
  );
  return rows;
}

export async function getFilmFromId(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      film.film_id,
      film.title,
      film.description,
      film.release_year,
      film.language_id,
      film.original_language_id,
      film.rental_duration,
      film.rental_rate,
      film.length,
      film.replacement_cost,
      film.rating,
      film.special_features,
      film.last_update
    FROM
      film
    WHERE
      film.film_id = ?;
    `,
    [id]
  );

  return rows[0];
}

export async function getFilmFromTitle(title) {
  const [rows] = await pool.query(
    `
    SELECT 
      film.film_id,
      film.title,
      film.description,
      film.release_year,
      film.language_id,
      film.original_language_id,
      film.rental_duration,
      film.rental_rate,
      film.length,
      film.replacement_cost,
      film.rating,
      film.special_features,
      film.last_update
    FROM
      film
    WHERE
      film.title = ?;
    `,
    [title]
  );

  return rows[0];
}

// actors with most film count.
export async function getTop5Actors() {
  const [rows] = await pool.query(
    `
    SELECT
      actor.actor_id,
      actor.first_name,
      actor.last_name,
      COUNT(*) AS film_count
    FROM 
      actor
    JOIN
      film_actor ON actor.actor_id = film_actor.actor_id
    GROUP BY
      actor.actor_id
    ORDER BY
      film_count DESC
    LIMIT 5;
    `
  );
  return rows;
}

export async function getActor(id) {
  // dont use ${id} to prevent sql injection attack
  //prepared statement
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM actor
    WHERE actor_id = ?`,
    [id]
  );
  return rows[0];
}

export async function getActorFilmCount(id) {
  const [rows] = await pool.query(
    `
    SELECT  
      COUNT(*) as film_count
    FROM 
      actor
    JOIN
      film_actor ON actor.actor_id = film_actor.actor_id
    WHERE actor.actor_id = ?`,
    [id]
  );
  return rows[0];
}

// is this even correct?
export async function getTop5FilmsFromActor(id) {
  const [rows] = await pool.query(
    `
    SELECT
      film.title,
      COUNT(*) as film_count
    FROM
      actor
    JOIN
      film_actor ON actor.actor_id = film_actor.actor_id
    JOIN
      film ON film.film_id = film_actor.film_id
    JOIN
      inventory ON film_actor.film_id = inventory.film_id
    JOIN 
      rental ON inventory.inventory_id = rental.inventory_id
    WHERE 
      actor.actor_id = ?
    GROUP BY film.title
    ORDER BY film_count DESC
    LIMIT 5
    `,
    [id]
  );
  return rows;
}

export async function getActors() {
  const [rows] = await pool.query("SELECT * FROM actor");
  return rows;
}

// actor_id is set to AUTO_INCREMENT
// last_update is automatically set as well.
export async function createActor(first_name, last_name) {
  const [result] = await pool.query(
    `
        INSERT INTO actor (first_name, last_name)
        VALUES (?,?)`[(first_name, last_name)]
  );
  const id = result.insertId;
  return getActor(id);
}
