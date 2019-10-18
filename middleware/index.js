const User = require('../models').User;
const Course = require('../models').Course;
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
let middlewareObj = {};

//authenticateUser middleware function
middlewareObj.authenticateUser = (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials.name) {
    // Attempt to retrieve the user from the db by their emailAddress from the Authorization header
    User.findOne({
        where: {
          emailAddress: credentials.name
        }
      })
      .then(user => {
        // If a user was successfully retrieved from the db
        if (user) {
          // Use the bcryptjs npm package to compare the user's password
          // (from the Authorization header) to the user's password
          // that was retrieved from the db
          const authenticated = bcrypt.compareSync(credentials.pass, user.password);
          // If the passwords match...
          if (user.password === credentials.pass || authenticated) {
            console.log(`Authentication successful for username: ${user.emailAddress}`);
            // Then store the retrieved user object on the request object
            req.currentUser = user;
            next();
          } else {
            res.status(401).send({
              message: "Incorrect password. Access denied."
            });
          }
        } else {
          res.status(401).send({
            message: "EmailAddress not found."
          });
        }
      })
  } else {
    res.status(400).send({
      message: "Please sign in."
    });
  }
};

//courseOwner middleware function
middlewareObj.courseOwner = (req, res, next) => {
  /*check if the provided :id route parameter value matches the course id and
  the course userId matches the currently authenticated user.*/
  Course.findOne({
      where: {
        id: req.params.id,
        userId: req.currentUser.id
      }
    })
    //if both IDs match, the currentUser is current course's owner
    .then(owner => {
      if (owner) {
        next();
      } else {
        res.status(403).json({
          message: 'Not course owner.'
        })
      }
    })
};
module.exports = middlewareObj;
