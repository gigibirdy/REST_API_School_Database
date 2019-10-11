var User = require('../models').User;
var Course = require('../models').Course;
var middlewareObj = {};
var bcrypt = require('bcryptjs');
var auth = require('basic-auth');

//authentication middleware function
middlewareObj.authenticateUser = (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the db by their emailAddress
    User.findOne({
      where: {
        emailAddress: credentials.name
      }
    }).then(user => {
      //if user exists in db...
      if (user) {
        //compare user's password from credentials with user's password stored in db
        const authenticated = bcrypt.compareSync(credentials.pass, user.password);
        //if identical, assign user to req.currentUser
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`);
          req.currentUser = user;
          next();
        }
      } else {
        //otherwise, send message to user
        res.json({
          message: 'Access Denied!'
        });
      }
    })
  } else {
    //if user's credentials are not available, tell user to sign in.
    res.status(401).json({
      message: 'Please sign in.'
    });
  }
};

//courseOwner middleware function
middlewareObj.courseOwner = (req, res, next) => {
  /*check if there is a course id matches the provided :id route parameter value
  and the course userId matches currentUser's id*/
  Course.findOne({
    where: {
      id: req.params.id,
      userId: req.currentUser.id
    }
  }).then(owner => {
    //if course exists, call next()
    if (owner) {
      next();
      //otherwise send a message to user
    } else {
      res.status(403).json({
        message: "Not course owner"
      })
    }
  })
}
module.exports = middlewareObj;
