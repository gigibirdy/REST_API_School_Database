var express = require('express');
var router = express.Router();
var Course = require('../models').Course;
var middleware = require('../middleware');
var User = require('../models').User;
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

//return a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'owner',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }],
  });
  res.status(200).json({
    courses: courses
  });
}));

//returns the course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async (req, res) => {
  try{
    const course = await Course.findAll({
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
      where: {
        id: req.params.id
      },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }],
    });
    if(course.length){
      res.status(200).json({
        course: course
      });
    } else {
      res.status(404).json({
        message: 'Course not found'
      });
    }
  } catch (error) {
    throw error;
  }
}));

//creates a course
router.post('/', middleware.authenticateUser, asyncHandler(async (req, res, next) => {
  try {
    const new_course = await Course.create(req.body);
     console.log(new_course.id)
    res.location(`/${new_course.id}`);
    res.status(201).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      error.status = 400;
      next(error);
    } else {
      throw error;
    }
  }
}));

//updates a course
router.put('/:id', middleware.authenticateUser, middleware.courseOwner, asyncHandler(async (req, res, next) => {
  let course;
  try {
      course = await Course.findByPk(req.params.id);
      if(course){
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(404).json({
          message: 'Course not found'
        });
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

//deletes a course
router.delete('/:id', middleware.authenticateUser, middleware.courseOwner, asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      await course.destroy();
      res.status(204).end();
    } catch (error) {
      throw error;
    }
}));

module.exports = router;
