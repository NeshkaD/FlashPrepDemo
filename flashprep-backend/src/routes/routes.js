// TODO: separate cards, decks, and users into separate routers.

module.exports = web_app => {
    let router = require("express").Router();
    const cardController = require("../controllers/card.controller.js"); // TODO: add routes for card operations
    const deckController = require("../controllers/deck.controller.js");
    const userController = require("../controllers/user.controller.js");
    const authController = require("../controllers/auth.controller.js");


  
    // Select a card from the deck based on weighted probability:
    router.get("/deck/:deckId/card", deckController.getNext); // deckId is a 'route parameter': https://expressjs.com/en/guide/routing.html

    // Reset all of the weighted probabilities associated with a given deck of cards:
    router.put("/deck/:deckId/reset", deckController.resetWeights);  

    // Delete an entire deck
    router.delete("/deck/:deckId/delete", deckController.delete);  

    // Get deck details and all of the deck's cards:
    router.get("/deck/:deckId", deckController.get);

    // Increment or decrement weight of a card based on isCorrect. 'isCorrect' should be specified in request body:
    router.put("/deck/:deckId/:cardId", deckController.updateWeight);

    // Post new deck to be created:
    router.post("/deck", deckController.create);  

    // Update a card's text values:
    router.put("/card", cardController.update);

    // Create a new card:
    router.post("/card", cardController.create);

    // Delete a card
    router.delete("/card/:cardId", cardController.delete);  

    // Get all of the decks owned by the specified user:
    router.get("/user/:userId/decks", userController.getDecks); 

    // Post password and username to request authentication:
    router.post("/auth", authController.authenticate);  

    // Post username, email address, and password to create a new user in the user table:
    router.post("/user", userController.createUser);  
  
    web_app.use('/', router);
  };
  