const sequelize = require('../models').sequelize;
const express = require('express');
const router = express.Router();

//test the connection to the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

//setup a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

router.get('/api', (req, res) => {
  res.redirect('/');
});

module.exports = router;
