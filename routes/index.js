const express = require('express');
const router = express.Router();
const path = require('path');


/** Get all the other routers */
const usersRouter = require('./users/users');


/** Set up all the routes */
router.use('/users', usersRouter);





/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + '../public/index.html');
});




router.get('/404', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/pages.404.html'))
  // res.sendFile(__dirname + '../public/pages.404.html');
});




module.exports = router;
