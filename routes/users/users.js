const express = require('express');
const router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});


/** Profile page of User */
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
