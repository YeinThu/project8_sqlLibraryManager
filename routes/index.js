var express = require('express');
var router = express.Router();
var Book = require('../models/').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  const books = await Book.findAll();
  res.json(books);
});

module.exports = router;
