const express = require('express');
const router = express.Router();


/** Get all the other routers */
const usersRouter = require('./users/users');


/** Set up all the routes */
router.use('/users', usersRouter);





/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('../public/index.html');
});




module.exports = router;
