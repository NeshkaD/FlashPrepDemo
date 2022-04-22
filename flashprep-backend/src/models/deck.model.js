let db = require('./mysql_db.js');

// ctr
const Deck = function(deck) {
    this.id = deck.id;
    this.userId = deck.userId;
    this.name = deck.name;
    this.description = deck.description;
};

Deck.findById = (deckId, callback) => {
    db.query(
        'SELECT * FROM deck WHERE id = ?',
        [deckId],
        (error, result) => {
            if (error) {
                console.log(`Failed to get deck associated with deckId ${deckId}. Error: ${error}`);
                // TODO: Handle the above error properly.
            }
            else {
                console.log(`Found ${result.length} decks with deckId ${deckId}`);
                callback(result);
            }
        }
    );
};

Deck.findAllByUserId = (userId, callback) => {
    db.query(
        'SELECT * FROM deck WHERE user_id = ?',
        [userId],
        (error, result) => {
            if (error) {
                console.log(`Failed to get all decks associated with userId ${userId}. Error: ${error}`);
                callback(result, error);
            }
            else {
                callback(result);
            }
        }
    );
};

Deck.create = (deckName, deckDescription, userId, cardArray, callback, error_callback) => {
    db.beginTransaction((err) => {
        console.log("1");
        if (err) { return db.rollback(() => error_callback(error)); }
        console.log("2");
        db.query('INSERT INTO deck (user_id, name, description) VALUES (?, ?, ?)',
            [userId, deckName, deckDescription],
            (error, result) => {
                console.log("3");
                if (error) {
                    return db.rollback(() => error_callback(error)); // error_callback should be a function that takes the error as an argument and handles it
                }
                console.log("4");

                let deckId = result.insertId;

                if (!cardArray) {
                    return db.commit((errorCommit) => {
                        if (errorCommit) {
                            return db.rollback(() => error_callback(errorCommit));
                        }
                        console.log("5");
                        console.log('Empty deck successfully created!');
                        callback(deckId);
                    });
                }

                // convert each card object in cardArray into a nested array using a mapping function. This is needed for the db insertion.
                let cardRows = [cardArray.map( (card) => [deckId, card.cardFront, card.cardBack] )]; 

                db.query('INSERT INTO card (deck_id, front_text, back_text) VALUES ?',
                cardRows, 
                (error2, result2) => {
                    if (error) {
                        return db.rollback(() => error_callback(error2)); // error_callback should be a function that takes the error as an argument and handles it
                    }
                    db.commit((errorCommit) => {
                        if (errorCommit) {
                            return db.rollback(() => error_callback(errorCommit));
                        }
                        console.log('Deck successfully created with cards!');
                        callback(deckId);
                    });
                });
            });
    });
};

Deck.delete = (deckId, callback, error_callback) => {
    db.beginTransaction((err) => {
        if (err) { return db.rollback(() => callback(false, err)); }
        db.query('DELETE FROM card WHERE deck_id = ?',
            [deckId],
            (error, result) => {
                if (error) {
                    return db.rollback(() => error_callback(error)); // error_callback should be a function that takes the error as an argument and handles it
                }

                db.query('DELETE FROM deck WHERE id = ?',
                [deckId],
                (error2, result2) => {
                    if (error) {
                        return db.rollback(() => error_callback(error2)); // error_callback should be a function that takes the error as an argument and handles it
                    }
                    db.commit((errorCommit) => {
                        if (errorCommit) {
                            return db.rollback(() => error_callback(errorCommit));
                        }
                        console.log(`Deck with ID ${deckId} deleted successfully!`);
                        callback(true);
                    });
                });
            });
    });
};

module.exports = Deck;
