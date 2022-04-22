let Card = require("../src/models/card.model.js");
let Deck = require("../src/models/deck.model.js");
let DeckController = require("../src/controllers/deck.controller.js");
let ch = DeckController.ch;

describe("Deck controller unit test suite", () => {
    it("should send card JSON in response when deck.controller::getNext called", () => {
        // set up:
        let testDeckId = '1';
        let response = null;
        let req = { "params": { "deckId": testDeckId } }
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
        res.send = (result) => {
            response = result;
        }
        let dbMockResult = [
            {
                id: 1,
                deck_id: 1,
                front_text: 'example card 1',
                back_text: 'This is the first test card. For testing purposes only. This is fake data. This is fake data. This is fake data.',
                weight: 1
            },
            {
                id: 2,
                deck_id: 1,
                front_text: 'example card 2',
                back_text: 'This is the second test card. For testing purposes only. This is fake data. This is fake data. This is fake data.',
                weight: 1
            },
            {
                id: 3,
                deck_id: 1,
                front_text: 'example card 3',
                back_text: 'This is the third test card. For testing purposes only. This is more fake data.',
                weight: 1
            }
        ];

        let expectedResponse = {
            "cardID": 2,
            "cardFront": "example card 2",
            "cardBack": "This is the second test card. For testing purposes only. This is fake data. This is fake data. This is fake data."
        };

        spyOn(ch, 'weighted').and.returnValue(dbMockResult[1]);

        spyOn(Card, 'findAllByDeckId').and.callFake(
            (deckId, callback) => {
                callback(dbMockResult);
            }
        );

        // act:
        DeckController.getNext(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should send full deck info in response when deck.controller::get called", () => {
        // set up:
        let testDeckId = '2';
        let response = null;
        let req = { "params": { "deckId": testDeckId } }
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
        res.send = (result) => {
            response = result;
        }

        // mock response from database when requesting deck from table
        let dbDeckMockResult = [
            {
                id: 2,
                user_id: 1,
                name: 'deck2',
                description: 'second demo deck. Test data here.'
            }
        ];

        // mock response from database when requesting all cards of deck 2 from table
        let dbCardsMockResult = [
            {
                id: 4,
                deck_id: 2,
                front_text: 'example card 4',
                back_text: 'This is the 4th test card. For testing purposes only. This is more fake data.',
                weight: 1
            },
            {
                id: 5,
                deck_id: 2,
                front_text: 'example card 5',
                back_text: 'This is the 5th test card. For testing purposes only. This is more fake data.',
                weight: 1
            },
            {
                id: 6,
                deck_id: 2,
                front_text: 'example card 6',
                back_text: 'This is the 6th test card. For testing purposes only. This is more fake data.',
                weight: 1
            }
        ];

        let expectedResponse = {
            "deckID": 2,
            "deckName": "deck2",
            "deckCardCount": 3,
            "cards": [
                {
                    "cardID": 4,
                    "cardFront": "example card 4",
                    "cardBack": "This is the 4th test card. For testing purposes only. This is more fake data."
                },
                {
                    "cardID": 5,
                    "cardFront": "example card 5",
                    "cardBack": "This is the 5th test card. For testing purposes only. This is more fake data."
                },
                {
                    "cardID": 6,
                    "cardFront": "example card 6",
                    "cardBack": "This is the 6th test card. For testing purposes only. This is more fake data."
                }
            ]
        };

        spyOn(Deck, 'findById').and.callFake(
            (deckId, callback) => {
                callback(dbDeckMockResult);
            }
        );

        spyOn(Card, 'findAllByDeckId').and.callFake(
            (deckId, callback) => {
                callback(dbCardsMockResult);
            }
        );

        // act:
        DeckController.get(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should call card.model::updateCardWeightIfExists with weightChange=1 when updateWeight called with isCorrect=true", () => {
        // set up:
        let testDeckId = '2';
        let testCardId = '4';
        let req = {
            "params": {
                "deckId": testDeckId,
                "cardId": testCardId
            },
            "body": {
                "isCorrect": true
            }
        };

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};
        res.send = (result) => { }

        // Variables to check whether correct arguments used:
        let deckIdUsedInCall = null;
        let cardIdUsedInCall = null;
        let weightChangeUsedInCall = null;


        let updateSpy = spyOn(Card, 'updateCardWeightIfExists').and.callFake(
            (deckId, cardId, weightChange, callback) => {
                deckIdUsedInCall = deckId;
                cardIdUsedInCall = cardId;
                weightChangeUsedInCall = weightChange
            }
        );


        // act:
        DeckController.updateWeight(req, res);

        // assert that call was made with correct arguments:
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(deckIdUsedInCall).toEqual(testDeckId);
        expect(cardIdUsedInCall).toEqual(testCardId);
        expect(weightChangeUsedInCall).toEqual(-1);
    });

    it("should call card.model::updateCardWeightIfExists with weightChange=-1 when updateWeight called with isCorrect=false", () => {
        // set up:
        let testDeckId = '2';
        let testCardId = '4';
        let req = {
            "params": {
                "deckId": testDeckId,
                "cardId": testCardId
            },
            "body": {
                "isCorrect": false
            }
        };

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};
        res.send = (result) => { }

        let mockModelResult = {
            "success": true,
            "updateApplied": true,
            "error": ""
        };

        // Variables to check whether correct arguments used:
        let deckIdUsedInCall = null;
        let cardIdUsedInCall = null;
        let weightChangeUsedInCall = null;


        let updateSpy = spyOn(Card, 'updateCardWeightIfExists').and.callFake(
            (deckId, cardId, weightChange, callback) => {
                deckIdUsedInCall = deckId;
                cardIdUsedInCall = cardId;
                weightChangeUsedInCall = weightChange;
                callback(mockModelResult);
            }
        );

        // act:
        DeckController.updateWeight(req, res);

        // assert:
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(deckIdUsedInCall).toEqual(testDeckId);
        expect(cardIdUsedInCall).toEqual(testCardId);
        expect(weightChangeUsedInCall).toEqual(1);
    });

    it("should return the unaltered outcome object from card.model::updateCardWeightIfExists when updateWeight called", () => {
        // set up:
        let testDeckId = '2';
        let testCardId = '4';
        let response = null;
        let req = {
            "params": {
                "deckId": testDeckId,
                "cardId": testCardId
            },
            "body": {
                "isCorrect": false
            }
        };

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};
        res.send = (result) => { response = result; }

        let mockModelResult = {
            "success": true,
            "updateApplied": true,
            "error": ""
        };

        spyOn(Card, 'updateCardWeightIfExists').and.callFake(
            (deckId, cardId, weightChange, callback) => {
                deckIdUsedInCall = deckId;
                cardIdUsedInCall = cardId;
                weightChangeUsedInCall = weightChange;
                callback(mockModelResult);
            }
        );

        // act:
        DeckController.updateWeight(req, res);

        // assert:
        expect(response).toEqual(mockModelResult);
    });

    it("should call card.model::resetCardWeightsInDeck once when resetWeights is called", () => {
        // set up:
        let testDeckId = '2';
        let response = null;
        let req = {
            "params": {
                "deckId": testDeckId
            }
        };

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};
        res.send = (result) => { response = result; }

        let mockModelResult = {
            "fieldCount": 0,
            "affectedRows": 3,
            "insertId": 0,
            "serverStatus": 2,
            "warningCount": 0,
            "message": "(Rows matched: 3  Changed: 0  Warnings: 0",
            "protocol41": true,
            "changedRows": 0
        };

        let deckIdUsedInCall = null;

        let modelSpy = spyOn(Card, 'resetCardWeightsInDeck').and.callFake(
            (deckId, callback) => {
                deckIdUsedInCall = deckId;
                callback(mockModelResult); // no error message passed in => happy path case
            }
        );

        // act:
        DeckController.resetWeights(req, res);

        // assert:
        expect(modelSpy).toHaveBeenCalledTimes(1);
        expect(deckIdUsedInCall).toEqual(testDeckId);
    });

    it("should send success result when resetWeights gets success response from card.model::resetCardWeightsInDeck", () => {
        // set up:
        let testDeckId = '2';
        let response = null;
        let req = {
            "params": {
                "deckId": testDeckId
            }
        };

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};
        res.send = (result) => { response = result; }

        let mockModelResult = {
            "fieldCount": 0,
            "affectedRows": 3,
            "insertId": 0,
            "serverStatus": 2,
            "warningCount": 0,
            "message": "(Rows matched: 3  Changed: 0  Warnings: 0",
            "protocol41": true,
            "changedRows": 0
        };

        let deckIdUsedInCall = null;

        let modelSpy = spyOn(Card, 'resetCardWeightsInDeck').and.callFake(
            (deckId, callback) => {
                deckIdUsedInCall = deckId;
                callback(mockModelResult); // no error message passed in => happy path case
            }
        );

        // act:
        DeckController.resetWeights(req, res);

        // assert:
        expect(response.success).toBeTrue();
        expect(response.error).toBeFalsy();
    });

    it("should send success result when resetWeights gets success response from card.model::resetCardWeightsInDeck (RainyDay)", () => {
        // set up:
        let testDeckId = '2';
        let response = null;
        let req = {
            "params": {
                "deckId": testDeckId
            }
        };

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};
        res.send = (result) => { response = result; }

        let mockModelResult = {
            "fieldCount": 0,
            "affectedRows": 3,
            "insertId": 0,
            "serverStatus": 2,
            "warningCount": 0,
            "message": "(Rows matched: 3  Changed: 0  Warnings: 0",
            "protocol41": true,
            "changedRows": 0
        };
        let mockErrorString = "Host is blocked because of many connection errors."

        spyOn(Card, 'resetCardWeightsInDeck').and.callFake(
            (deckId, callback) => {
                callback(mockModelResult, mockErrorString); // no error message passed in => happy path case
            }
        );

        // act:
        DeckController.resetWeights(req, res);

        // assert:
        expect(response.success).toBeFalse();
        expect(response.error).toEqual(mockErrorString)
    });
});