const Card = require("../models/card.model.js");

exports.update = (req, res) => {
    console.log('card.controller::update called');
    let cardId = req.body.cardID;
    let cardFront = req.body.cardFront;
    let cardBack = req.body.cardBack;
    Card.update(cardId, cardFront, cardBack,
        (db_result) => res.send(
            {
                success: true,
                error: null
            }
        ),
        (db_error) => res.send(
            {
                success: false,
                error: db_error
            }
        )
    );
};

exports.create = (req, res) => {
    console.log('card.controller::create called');
    let cardFront = req.body.card.cardFront;
    let cardBack = req.body.card.cardBack;
    let deckId = req.body.deckID
    Card.create(cardFront, cardBack, deckId,
        (new_card_id) => res.send(
            {
                success: true,
                id: new_card_id,
                error: null
            }
        ),
        (db_error) => res.send(
            {
                success: false,
                id: null,
                error: db_error
            }
        )
    );
};

exports.delete = (req, res) => {
    console.log('card.controller::delete called');
    let cardId = req.params.cardId;
    Card.delete(cardId,
        (result) => res.send(
            {
                success: true
            }
        ),
        (db_error) => res.send(
            {
                success: false,
                error: db_error
            }
        )
    );
};