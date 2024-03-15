# LightBnB

A simple multi-page AirBNB clone that uses server side Javascript to display information from queries to web pages via SQL queries.
I used PostgreSQL to create the database, tables and entries then used SQL queries to return information to the user.
With this app, you are able to add a new user, add a new listing of your own and search for various listings using different filtering methods.

## Screenshots

!["Screenshot of the addNewUser function"](https://github.com/Upgrayedd0408/LightBnB/blob/master/docs/new_user.png)
!["Screenshot of the addNewProperty Function"](https://github.com/Upgrayedd0408/LightBnB/blob/master/docs/add_new_property.png)
!["Screenshot of the search form"](https://github.com/Upgrayedd0408/LightBnB/blob/master/docs/search_properties.png)
!["Screenshot of the page that shows your listings](https://github.com/Upgrayedd0408/LightBnB/blob/master/docs/my_listings.png)

## Dependencies

 - bcrypt
 - cookie-session
 - express-JS
 - nodemon
 - PostgreSQL

## Getting Started

Clone the repo to your local machine. git clone ...
Open terminal and cd into the LightBnB_WebApp-master file.
Run `npm install` to install the appropriate dependencies
Start a new psql session
Create a LightBnB database, [CREATE DATABASE lightbnb], and connect to it using \c lightbnb
Run \i migrations/01_schema.sql to set up the tables.
Run \i seeds/01_seeds.sql and \i seeds/02_seeds.sql to insert data into the tables.
Run `npm run local` to start up the server.
Open web browser and enter `localhost:3000` to run the app.

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.
