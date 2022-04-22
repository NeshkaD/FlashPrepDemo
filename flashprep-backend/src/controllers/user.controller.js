const Deck = require("../models/deck.model.js");
const User = require("../models/user.model.js");

exports.getDecks = (req, res) => {
    console.log('user.controller::getDecks called');
    Deck.findAllByUserId(
        req.params.userId,
        (decks, err) => {
            if(err) {
                res.sendStatus(500);
            }
            res.send(decks);
        }
    );
};

exports.createUser = (req, res) => {
    console.log('auth.controller::register called'); 

    if (!req.body.username) {
        let returnObj = {
            "success": false,
            "error": "Username cannot be empty"
        };
        res.send(returnObj);
        return;
    }

    if (!req.body.email) {
        let returnObj = {
            "success": false,
            "error": "Email cannot be empty"
        };
        res.send(returnObj);
        return;
    }

    if (!req.body.password) {
        let returnObj = {
            "success": false,
            "error": "Password cannot be empty"
        };
        res.send(returnObj);
        return;
    }

    // TODO: improve auth with tokens
    User.createUser(
        req.body.username,
        req.body.email,
        req.body.password,
        (outcomeObj) => {
            let returnObj = {
                "success": true,
                "error": ""
            };
            
            if (!outcomeObj.usernameUnique) {
                returnObj.success = false;
                returnObj.error += `Username ${req.body.username} is already taken - Please try a different username. `; 
            }
            if (!outcomeObj.emailUnique) {
                returnObj.success = false;
                returnObj.error += `Email address ${req.body.email} is already connected to an account. Please use a different email address. `; 
            }

            if (outcomeObj.usernameUnique && outcomeObj.emailUnique && !outcomeObj.success) {
                returnObj.success = false;
                returnObj.error = 'Sorry, something went wrong! Please try again.'; 
            }

            res.send(returnObj);            
        }
      );
  };