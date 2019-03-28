const express = require('express');
const router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});


router.get('/login', function(req, res, next) {
  res.sendFile(__dirname + '../../public/pages/login.html');
});


/** Profile page of User */
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
