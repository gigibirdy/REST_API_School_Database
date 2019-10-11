const express = require('express');
const router = express.Router();
const User = require('../models').User;
const bcrypt = require('bcryptjs');
var middleware = require('../middleware');

//use bodyParser middleware bundled with Express
router.use(express.json());
router.use(express.urlencoded({
  extended: false
}));

//Handler function to wrap each route
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

//create new user
router.post('/', asyncHandler(async (req, res, next) => {
  try {
    if(!req.body.password || !req.body.emailAddress || !req.body.firstName || !req.body.lastName) {
      res.status(400).json({
        message: "First and last name, email address and password can not be empty. Please check your input and re-submit."
      })
    } else if(await User.findOne({where: {emailAddress: req.body.emailAddress.toLowerCase()}})){
      res.status(400).json({
        message: "Existing email address."
      })
    } else {
      var salt = bcrypt.genSaltSync(10);
      var password = bcrypt.hashSync(req.body.password, salt);
      req.body.password = password;
      await User.create(req.body);
      res.location('/');
      res.status(201).end();
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      error.status = 400;
      next(error);
    } else {
      throw error;
    }
  }
}));

//returns the currently authenticated user
router.get('/', middleware.authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
}));

module.exports = router;
