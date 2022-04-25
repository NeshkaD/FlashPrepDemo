# FlashPrep API Backend README #

### What is this repository for? ###

This is the back end API for FlashPrep

### How do I get set up? ###

* Install [node](https://nodejs.org/en/)
* Install Database [mysql](https://www.mysql.com/)
* Clone this repository
* To install the package on package.json just run

    `npm install`

* To run the application for development purposes

    `node ./server.js`

    This will start the server on `http://localhost:8080/ `

### Run Test
Running the test suite is easy.
1. Run the following command `npm test` 

### Who do I talk to? ###

* Jared Barber (Product Manager) 
* Arunabh Bhattacharya (Developer) 
* Neshka Dantinor (Developer) 
* Gustavo Cruz-Medina (Scrum Master)



## API Documentation


### API Endpoints

List of available routes:

`GET /deck/:deckId/card` - Select a card from the deck based on weighted probability\
`PUT /deck/:deckId/reset` - Reset all of the weighted probabilities associated with a given deck of cards\
`DELETE /deck/:deckId/delete` - Delete an entire deck\
`GET /deck/:deckId` - Get deck details and all of the deck's cards\
`PUT /deck/:deckId/:cardId` - Increment or decrement weight of a card based on isCorrect. 'isCorrect' should be specified in request bodys\
`POST /deck` - Create new deck\
`PUT /card` - Update a card's text values\
`POST /card` - Create a new card\
`DELETE /card/:cardId` - Delete the specified card\
`GET /user/:userId/decks` - Get all of the decks owned by the specified user\
`POST /auth` - Post password and username to request authentication\
`POST /user` - Post username, email address, and password to create a new user in the user table


