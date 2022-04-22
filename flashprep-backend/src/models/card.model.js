let db = require('./mysql_db.js');

// ctr
const Card = function(card) {
    this.id = card.id;
    this.deckId = card.deckId;
    this.title = card.title;
    this.body = card.body;
    this.weight = card.weight;
};

// This parameter order has been chosen to match the nodejs mysql API being used. 
Card.findAllByDeckId = (deckId, callback) => {
    db.query(
        'SELECT * FROM card WHERE deck_id = ?',
        [deckId],
        (error, result) => {
            if (error) {
                console.log(`Failed to get all cards associated with ${deckId}. Error: ${error}`);
                // TODO: Handle the above error properly.
            }
            else if (result.length < 1) {
                console.log(`Deck with ID ${deckId} is empty!`);
                // TODO: Handle the above error properly.
            }
            else {
                callback(result);
            }
        }
    );
}

Card.updateCardWeightIfExists = (deckId, cardId, weightChange, callback) => {
    returnObj = {
        success: false,
        updateApplied: false,
        error: ''
    }
    db.query(
        'SELECT * FROM card WHERE deck_id = ? AND id = ?',
        [deckId, cardId],
        (error, result) => {
            if (error) {
                console.log(`Failed to get card with card ID ${cardId} from deck with ID ${deckId}. Error: ${error}`);
                returnObj.error = error;
                callback(returnObj);
            }
            else if (result.length < 1) {
                let error_description = `Card with ID ${cardId} does not exist in deck with ID ${deckId}`;
                console.log(error_description);
                returnObj.error = error_description;
                callback(returnObj);
            }
            else if (result[0].weight + weightChange < 1) {
                console.log(`Card with ID ${cardId} would have negative weight if weightChange ${weightChange} is applied. Cannot complete operation.`);
                returnObj.success = true;
                callback(returnObj);
            }
            else {
                db.query(
                    'UPDATE card SET weight = weight + ? WHERE id = ?', 
                    [weightChange, cardId],
                    (error, result) => {
                        if (error) {
                            console.log(`Failed to update weight of card with ID ${cardId}`);
                            returnObj.error = error;
                            callback(returnObj);
                        }
                        else{
                            returnObj.success = true;
                            returnObj.updateApplied = true;
                            callback(returnObj);
                        }
                    }
                );
            }
        }
    );
}

Card.resetCardWeightsInDeck = (deckId, callback) => {
    db.query(
        'UPDATE card SET weight = 1 WHERE deck_id = ?',
        [deckId],
        (error, result) => {
            if (error) {
                console.log(`Failed to get card with card ID ${cardId} from deck with ID ${deckId}. Error: ${error}`);
                callback(result, error);
            }
            else{
                callback(result);
            }
        }
    );
}

Card.update = (cardId, cardFront, cardBack, callback, error_callback) => {
    let query =  'UPDATE card SET';
    let queryArgs = [];
    if (cardFront) {
        query += ' front_text = ? ,';
        queryArgs.push(cardFront);
    }
    if (cardBack) {
        query += ' back_text = ? ,';
        queryArgs.push(cardBack);
    }
    if (query.endsWith(',') ) {
        query = query.substring(0, query.length - 1);
    }
    queryArgs.push(cardId);
    query += 'WHERE id = ?';
    db.query(
        query,
        queryArgs,
        (error, result) => {
            if (error) {
                console.log(`Failed to update card with card ID ${cardId}. Error: ${error}`);
                error_callback(error);
            }
            else{
                callback(result);
            }
        }
    );
}

Card.create = (cardFront, cardBack, deckId, callback, error_callback) => {
    db.query('INSERT INTO card (deck_id, front_text, back_text) VALUES (?, ?, ?)',
        [deckId, cardFront, cardBack],
        (error, result) => {
            if (error) {
                console.log(`Failed to create new card in deck with deck ID ${deckId}. Error: ${error}`);
                error_callback(error);
            }
            else{
                console.log(`Created new card in deck with deck ID ${deckId}.`);
                callback(result.insertId);
            }
        }
    );
}

Card.delete = (cardId, callback, error_callback) => {
    db.query('DELETE FROM card WHERE id = ?',
            [cardId],
            (error, result) => {
                if (error) {
                    error_callback(error); // error_callback should be a function that takes the error as an argument and handles it
                }
                else {
                    callback(result);
                }
            });
}

module.exports = Card;
