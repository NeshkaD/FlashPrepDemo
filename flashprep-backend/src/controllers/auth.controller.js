const User = require("../models/user.model.js");


/*
HTTP response body contains JSON with the following format:
{
    "isLoggedIn": true,
    "user_id": id
}
*/
function isAuthenticated(userDataObj, password) {
    return userDataObj.password == password; 
}

exports.authenticate = (req, res) => {
  console.log('auth.controller::authenticate called');
  // TODO: improve auth with tokens
  User.findUserByUsername(
      req.body.username,
      (user) => {
          let isLoggedIn = isAuthenticated(user, req.body.password);
          let return_obj = {
              "isLoggedIn": isLoggedIn,
              "userId": isLoggedIn ? user.id : null
            };
          res.send(return_obj);
      },
      (error_description) => res.send({
        "isLoggedIn": false,
        "userId": null
      }) // TODO: improve error info.
    );
};
