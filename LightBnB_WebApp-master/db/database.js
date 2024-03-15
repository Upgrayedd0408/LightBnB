const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


const properties = require("./json/properties.json");
const users = require("./json/users.json");



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 * Accepts an email address and will return a promise.
 * The promise should resolve with a user object with the given email address, or null if that user does not exist.
 */
const getUserWithEmail = function (email) {
  return pool.query (`
    SELECT *
    FROM users
    WHERE email = $1
  `, [email])
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  })

};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query (`
    SELECT *
    FROM users
    WHERE id = $1
  `, [id])
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
  })
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 * Accepts a user object that will have a name, email, and password property
 * This function should insert the new user into the database.
 * It will return a promise that resolves with the new user object. This object should contain the user's id after it's been added to the database.

 */
const addUser = function (user) {
  return pool.query (`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [user.name, user.email, user.password])
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err);
  });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query (`
    SELECT reservations.*, properties.*
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    WHERE reservations.guest_id = $1
    ORDER BY reservations.start_date
    LIMIT $2;
  `, [guest_id, limit])
  .then((result) => {
    return result.rows;
  })
  .catch((err) => {
    console.error(err.message);
  })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE LOWER(city) LIKE LOWER($${queryParams.length}) `; 
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id); // Directly push the owner_id without '%'
    // Check if this is the first condition
    if (queryParams.length === 1) { 
        queryString += `AND owner_id = $${queryParams.length} `;
    } else {
        queryString += `WHERE owner_id = $${queryParams.length} `;
    }
  }

  const minPrice = options.minimum_price_per_night * 100
  const maxPrice = options.maximum_price_per_night * 100


  if (minPrice && maxPrice) {
      queryParams.push(minPrice);
      queryParams.push(maxPrice);
      // Add the appropriate SQL keyword based on whether it's the first condition
      const conditionKeyword = queryParams.length >= 1 ? 'AND' : 'WHERE';
      // Correct usage of `$${queryParams.length - 1}` for the first added parameter
      // and `$${queryParams.length}` for the second.
      queryString += `${conditionKeyword} cost_per_night BETWEEN $${queryParams.length-1} AND $${queryParams.length} `;
  }

  
  // 4
  queryString += `
  GROUP BY properties.id
  `;
  
  if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }
  
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length + 1};
  `;
  
  // Finally, pushing the limit parameter after adjustments for HAVING
  queryParams.push(limit);

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
    .then((result) => {
    console.log(result.rows, "query results")
    return result.rows;
    })
    .catch((err) =>  {
      console.error('Query error', err.stack)
    });
};



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return pool.query (`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code])
  .then((result) => {
    return result.rows
  })
  .catch((err) => {
    console.error(err.stack);
  })
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
