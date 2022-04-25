let Deck = require("../src/models/deck.model.js");
let User = require("../src/models/user.model.js");
let UserController = require("../src/controllers/user.controller.js");

describe("User controller unit test suite", () => {
    it("should call deck.model::findAllByUserId when getDecks called", () => {
        // set up:
        let testUserId = '2';
        let response = null;
        let req = { "params": { "userId": testUserId } }
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
        res.send = (result) => {
            response = result;
        }

        let dbMockResult = [
            {
              id: 10,
              user_id: 2,
              name: 'deck10',
              description: '10th demo deck. Test data here.'
            },
            {
              id: 12,
              user_id: 2,
              name: 'deck12',
              description: '12th demo deck. Test data here.'
            }
          ];

        let userIdPassedAsArg = null;

        let modelSpy = spyOn(Deck, 'findAllByUserId').and.callFake(
            (userId, callback) => {
                userIdPassedAsArg = userId;
                callback(dbMockResult);
            }
        );

        // act:
        UserController.getDecks(req, res);

        // assert:
        expect(modelSpy).toHaveBeenCalledTimes(1);
        expect(userIdPassedAsArg).toEqual(testUserId);
    });

    it("should send 500 status code when getDecks called on User that does not exist (RainyDay test)", () => {
        // set up:
        let testUserId = '2';
        let response = null;
        let statusCode = null
        let isResponseSent = false
        let req = { "params": { "userId": testUserId } }

        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.send = (result) => {
            response = result;
        }

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let dbMockResult = [
            {
              id: 10,
              user_id: 2,
              name: 'deck10',
              description: '10th demo deck. Test data here.'
            },
            {
              id: 12,
              user_id: 2,
              name: 'deck12',
              description: '12th demo deck. Test data here.'
            }
          ];

        let mockError = 'User ID does not exist';

        let userIdPassedAsArg = null;

        let modelSpy = spyOn(Deck, 'findAllByUserId').and.callFake(
            (userId, callback) => {
                userIdPassedAsArg = userId;
                callback(dbMockResult, mockError);
            }
        );

        // act:
        UserController.getDecks(req, res);

        // assert:
        expect(statusCode).toEqual(500);
        expect(isResponseSent).toBeTrue();
    });

    it("should empty array in response when getDecks called on a user that has no decks (Boundary test)", () => {
        // set up:
        let testUserId = '1';
        let response = null;
        let req = { "params": { "userId": testUserId } }
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
        res.send = (result) => {
            response = result;
        }

        let dbMockResult = [];
        let expectedResponse = [];

        spyOn(Deck, 'findAllByUserId').and.callFake(
            (userId, callback) => {
                callback(dbMockResult);
            }
        );

        // act:
        UserController.getDecks(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should send all decks of a user in response when getDecks called", () => {
        // set up:
        let testUserId = '1';
        let response = null;
        let req = { "params": { "userId": testUserId } }
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
        res.send = (result) => {
            response = result;
        }

        let dbMockResult = [
            {
              id: 1,
              user_id: 1,
              name: 'deck1',
              description: 'first demo deck. Test data here.'
            },
            {
              id: 2,
              user_id: 1,
              name: 'deck2',
              description: 'second demo deck. Test data here.'
            }
          ];

        let expectedResponse = [
            {
                "id": 1,
                "user_id": 1,
                "name": "deck1",
                "description": "first demo deck. Test data here."
            },
            {
                "id": 2,
                "user_id": 1,
                "name": "deck2",
                "description": "second demo deck. Test data here."
            }
        ];

        spyOn(Deck, 'findAllByUserId').and.callFake(
            (userId, callback) => {
                callback(dbMockResult);
            }
        );

        // act:
        UserController.getDecks(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure result in response when username not provided (RainyDay test)", () => {
        // set up:
        let testUsername = '';
        let testEmail = 'lorem_ipsum@gmail.com';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let expectedResponse = {
            "success": false,
            "error": "Username cannot be empty"
        };

        let createUserSpy = spyOn(User, 'createUser').and.callFake((userId, callback) => {});

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(createUserSpy).not.toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure result in response when email not provided (RainyDay test)", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testEmail = '';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let expectedResponse = {
            "success": false,
            "error": "Email cannot be empty"
        };

        let createUserSpy = spyOn(User, 'createUser').and.callFake((userId, callback) => {});

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(createUserSpy).not.toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure result in response when password not provided (RainyDay test)", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testEmail = 'lorem_ipsum@gmail.com';
        let testPassword = '';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let expectedResponse = {
            "success": false,
            "error": "Password cannot be empty"
        };

        let createUserSpy = spyOn(User, 'createUser').and.callFake((userId, callback) => {});

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(createUserSpy).not.toHaveBeenCalled();
        expect(response).toEqual(expectedResponse);
    });

    it("should return success result in response when user.model::createUser succeeds", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testEmail = 'lorem_ipsum@gmail.com';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let expectedResponse = {
            "success": true,
            "error": ""
        };

        spyOn(User, 'createUser').and.callFake((username, email_address, password, callback) => {
            let dbOutcomeObj = {
                success: true,
                usernameUnique: true,
                emailUnique: true
            };
            callback(dbOutcomeObj);
        });

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure result in response when user.model::createUser fails due to non-unique username (RainyDay Test)", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testEmail = 'lorem_ipsum@gmail.com';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let expectedResponse = {
            "success": false,
            "error": "Username lorem_ipsum is already taken - Please try a different username. "
        };

        spyOn(User, 'createUser').and.callFake((username, email_address, password, callback) => {
            let dbOutcomeObj = {
                success: false,
                usernameUnique: false,
                emailUnique: true
            };
            callback(dbOutcomeObj);
        });

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure result in response when user.model::createUser fails due to non-unique email (RainyDay Test)", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testEmail = 'lorem_ipsum@gmail.com';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        let expectedResponse = {
            "success": false,
            "error": "Email address lorem_ipsum@gmail.com is already connected to an account. Please use a different email address. "
        };

        spyOn(User, 'createUser').and.callFake((username, email_address, password, callback) => {
            let dbOutcomeObj = {
                success: false,
                usernameUnique: true,
                emailUnique: false
            };
            callback(dbOutcomeObj);
        });

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure result in response when user.model::createUser fails due to any error (RainyDay Test)", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testEmail = 'lorem_ipsum@gmail.com';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let req = { 
            "body": { 
                "username": testUsername,
                "email": testEmail,
                "password": testPassword
            } 
        };
        
        // mock responder obj to send response to a local variable for verification instead of sending http response
        let res = {};

        res.status = (code) => {
            statusCode = code;
        }

        res.send = (responseText) => {
            response = responseText;
            isResponseSent = true;
        }

        res.sendStatus = (code) => {
            statusCode = code;
            isResponseSent = true;
        }

        spyOn(User, 'createUser').and.callFake((username, email_address, password, callback) => {
            let dbOutcomeObj = {
                success: false,
                usernameUnique: true,
                emailUnique: false
            };
            callback(dbOutcomeObj);
        });

        // act:
        UserController.createUser(req, res);

        // assert:
        expect(response.success).toBeFalse();
        expect(response.error).toBeTruthy();
    });
});
