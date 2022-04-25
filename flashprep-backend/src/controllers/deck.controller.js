const Card = require("../models/card.model.js");
const Deck = require("../models/deck.model.js");
exports.ch = require('chance').Chance(); // included in exports to be mocked
exports.weighted = (arr, weights_arr) => {
    return this.ch.weighted(arr, weights_arr);
};

// Chooses a row from the card table randomly using weighted probability.
exports.getWeightedChoice = (cards) => {
    console.log(cards);
    let weights = new Array(cards.length);
    let index = 0;
    for (let row of cards) {
        weights[index] = row.weight;
        index++;
    }
    let chosenCard = this.weighted(cards, weights);
    return chosenCard;
}

exports.getNext = (req, res) => {
  console.log('deck.controller::getNext called');
  Card.findAllByDeckId(req.params.deckId, (cards) => {
      let nextCard = this.getWeightedChoice(cards);
      let return_obj = {
        "cardID": nextCard.id,
        "cardFront": nextCard.front_text,
        "cardBack": nextCard.back_text  
      };
      res.send(return_obj);
  });
};

exports.get = (req, res) => {
    console.log('deck.controller::get called');
    Deck.findById(req.params.deckId, (result) => {
        if (result.length < 1) {
            res.sendStatus(404); // TODO: Rainyday test case for this!
        }
        if (result.length > 1) {
            console.log(`deck.controller::get found multiple decks with deckId ${req.params.deckId}`);
            res.sendStatus(500); // TODO: consider if this is testable. Likely no possible due to DB 'Unique' constraint
        }
        let selectedDeck = result[0];
        let returnObj = {
            "deckID": selectedDeck.id,
            "deckName": selectedDeck.name,
            "deckCardCount": 0,
            "cards": []
        }
        console.log(`Searching for cards associated with deck ${req.params.deckId}`);
        Card.findAllByDeckId(req.params.deckId, (cards) => {
            returnObj.deckCardCount = cards.length;
            for (let row of cards) {
                let currentCard = {
                    "cardID": row.id,
                    "cardFront": row.front_text,
                    "cardBack": row.back_text
                }
                returnObj.cards.push(currentCard);
            }
            res.send(returnObj);
        });
    });
};

exports.updateWeight = (req, res) => {
    console.log('deck.controller::updateWeight called');
    let deckId = req.params.deckId;
    let cardId = req.params.cardId;
    Card.updateCardWeightIfExists(deckId, cardId, req.body.isCorrect ? -1 : 1, 
        (db_result) => res.send(db_result)
    );
};

exports.resetWeights = (req, res) => {
    console.log('deck.controller::resetWeights called');
    let deckId = req.params.deckId;
    Card.resetCardWeightsInDeck(deckId, (db_output, error) => {
        let resultObj = {"success": true, "error": ''}
        if (error) {
            resultObj.success = false;
            resultObj.error = error;
        }
        res.send(resultObj);
    });
};

exports.delete = (req, res) => {
    console.log('deck.controller::delete called');
    Deck.delete(req.params.deckId,
        (isSuccessful, errorMessage) => {
            res.send({
                success: isSuccessful,
                error: errorMessage
            });
        },
        (error_msg) => res.status(500).send(error_msg)
    );
};

exports.create = (req, res) => {
    console.log('deck.controller::create called');
    console.log(req.body.deckName);
    console.log(req.body.deckDescription);
    console.log(req.body.userID);
    console.log(req.body.cards);

    Deck.create(req.body.deckName, req.body.deckDescription, req.body.userID, req.body.cards,
        (deckId) => {
            res.send({
                success: true,
                deckID: deckId
            });
        },
        (error_msg) => res.status(500).send(error_msg)
    );
};
