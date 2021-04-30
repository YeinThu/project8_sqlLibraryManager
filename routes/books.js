var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* Global async route handler */
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    }
    catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET display full list of books. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({
    order: [["title", "ASC"]] // Finds and displays all books in ascending "title" order
  });
  res.render('books/all_books', { title: "Books", books });
}));

/* GET display the create new book form */
router.get('/new', (req, res) => {
  res.render('books/new_book', { title: "New Book", book: {} });
});

/* POST add a new book to the database */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  }
  catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('books/new_book', { title: "New Book", book, errors: error.errors });
    }
    else {
      throw error;
    }
  }
}));

/* GET display individual book detail form */
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id); // Find by Primary Key or Id
  if (book) {
    res.render('books/book_detail', { title: book.title, book });
  }
  else {
    res.sendStatus(404);
  }
}));

/* POST updates book info in the database */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    }
    else {
      res.sendStatus(404);
    }
  }
  catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/book_detail', { title: book.title, book, errors: error.errors });
    }
    else {
      throw error;
    }
  }
}));

/* POST delete a book from the database */
router.post('/:id/delete', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } 
  else {
    res.sendStatus(404);
  }
}));

module.exports = router;
