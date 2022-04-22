let User = require("../src/models/user.model.js");
let AuthController = require("../src/controllers/auth.controller.js");

describe("Auth controller unit test suite", () => {
    it("should call return details of login when authenticate is called successfully", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let isResponseSent = null;
        let req = { "body": { 
            "username": testUsername,
            "password": testPassword
        } 
    };
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
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

        let dbMockResult = {
            id: 15,
            username: 'lorem_ipsum',
            email: 'lorem_ipsum@gmail.com',
            password: 'Let-me-in-PL34$3'
        };

        let expectedResponse = {
            "isLoggedIn": true,
            "userId": 15
        }

        let modelSpy = spyOn(User, 'findUserByUsername').and.callFake(
            (username, callback) => {
                callback(dbMockResult);
            }
        );

        // act:
        AuthController.authenticate(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should call user.model::findUserByUsername once during authentication", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let isResponseSent = null;
        let req = { "body": { 
            "username": testUsername,
            "password": testPassword
        } 
    };
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
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

        let dbMockResult = {
            id: 15,
            username: 'lorem_ipsum',
            email: 'lorem_ipsum@gmail.com',
            password: 'Let-me-in-PL34$3'
        };

        let modelSpy = spyOn(User, 'findUserByUsername').and.callFake(
            (username, callback) => {
                callback(dbMockResult);
            }
        );

        // act:
        AuthController.authenticate(req, res);

        // assert:
        expect(modelSpy).toHaveBeenCalledTimes(1);
    });

    it("should return failure object when authentication fails due to incorrect password (RainyDay Test)", () => {
        // set up:
        let testUsername = 'lorem_ipsum';
        let testPassword = 'let-me-in-NOW';
        let response = null;
        let isResponseSent = null;
        let req = { "body": { 
            "username": testUsername,
            "password": testPassword
        } 
    };
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
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

        let dbMockResult = {
            id: 15,
            username: 'lorem_ipsum',
            email: 'lorem_ipsum@gmail.com',
            password: 'Let-me-in-PL34$3'
        };

        let expectedResponse = {
            "isLoggedIn": false,
            "userId": null
        }

        let modelSpy = spyOn(User, 'findUserByUsername').and.callFake(
            (username, callback) => {
                callback(dbMockResult);
            }
        );

        // act:
        AuthController.authenticate(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });

    it("should return failure object when authentication fails due to invalid username (RainyDay Test)", () => {
        // set up:
        let testUsername = 'username-that-does-not-exist';
        let testPassword = 'Let-me-in-PL34$3';
        let response = null;
        let isResponseSent = null;
        let req = { "body": { 
            "username": testUsername,
            "password": testPassword
        } 
    };
        let res = {};

        // mock responder obj to send response to a local variable for verification instead of sending http response
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

        let dbMockErrorResult = `Failed to find user with username ${testUsername}. Error: username does not exist`

        let expectedResponse = {
            "isLoggedIn": false,
            "userId": null
        }

        let modelSpy = spyOn(User, 'findUserByUsername').and.callFake(
            (username, callback, err_callback) => {
                err_callback(dbMockErrorResult);
            }
        );

        // act:
        AuthController.authenticate(req, res);

        // assert:
        expect(response).toEqual(expectedResponse);
    });
});