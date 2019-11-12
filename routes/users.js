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
    if(req.body.password){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;
      const user = await User.create(req.body);
      res.location('/');
      res.status(201).end();
    } else {
      res.status(400).json({
      message: "please provide email address, password, first and last name."
      })
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      errorItems = error.errors.map(error =>
         ' ' + error.path
      )
      res.status(400).json({
        message: `Please provide${errorItems}`
      })
    } else if (await User.findOne({where: {emailAddress: req.body.emailAddress.toLowerCase()}})){
      res.status(400).json({
        message: "Existing email address."
      })
    } else {
      throw error;
    }
  }
}));

//returns the currently authenticated user
router.get('/', middleware.authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
    }
  });
}));

module.exports = router;
