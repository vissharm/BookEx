const express = require('express');
const router = express.Router();

const booksController = require('../controllers/booksController');
const usersController = require('../controllers/usersController');
const emailController = require('../controllers/emailController');
const ordersController = require('../controllers/ordersController');

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Register a new user
router.post('/users/register', usersController.createUser, (req, res) => {
  return res.status(201).json(res.locals); // 201 for resource creation
});

// Verify user account - login verification
router.post('/users/verify', usersController.verifyUser, (req, res) => {
  return res.status(200).json(res.locals);
});

// Reset password (password resets typically use POST)
router.post('/users/reset-password', usersController.resetPassword, emailController.sendEmail, (req, res) => {
  return res.status(200).json(res.locals);
});

// Check availability for email, phone, or username via query params
router.get('/users/check-availability', (req, res, next) => {
  const { type, value } = req.query;
  if (type === 'email') {
    usersController.checkEmailAvailability(req, res, next);
  } else if (type === 'phone') {
    usersController.checkContactAvailability(req, res, next);
  } else if (type === 'username') {
    usersController.checkUsernameAvailability(req, res, next);
  } else {
    return res.status(400).json({ error: 'Invalid type specified' });
  }
}, (req, res) => {
  return res.status(200).json(res.result.available)
});

// Update user profile (using PATCH for partial updates)
router.patch('/users/profile', usersController.updateProfile, (req, res) => {
  return res.status(200).json(res.result.user);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// BOOK RELATED APIS

// POST /books - Insert new book in database
router.post('/books', booksController.findBookByIsbn, booksController.addBook, booksController.addUserBook, (req, res) => {
  console.log(`${res.result.userBookData} --------`);
  return res.status(200).json(res.result.userBookData);
});

// PUT /books/:bookId - Update a specific book details
router.put('/books/:bookId', booksController.updateBook, booksController.updateUserBook, (req, res) => {
  console.log(`${res.result.userBookData} --------`);
  return res.status(200).json(res.result.userBookData);
});

// PATCH /books/:bookId - Partially update a specific book (e.g., book status)
router.patch('/books/user/:bookId', booksController.updateUserBookStatus, (req, res) => {
  console.log(`${res.result.updatedBookData} --------`);
  return res.status(200).json(res.result.updatedBookData);
});

// POST /books/search/available - Search available books (could be renamed to /books/search to be more general)
router.post('/books/search', booksController.searchBook, (req, res) => {
  console.log(`${res.result.searchResult} --------`);
  return res.status(200).json(res.result.searchResult);
});


// GET /orders/:userId - Get all ordered books for a user
router.get('/orders/:userId', ordersController.getOrderedBooks, (req, res) => {  // Changed to /orders/:userId for clarity
  console.log(`${res.result.orderedBooks} --------`);
  return res.status(200).json(res.result.orderedBooks);
});


// GET /orders/:userId/received - Get all received orders for a user (book orders marked as received)
router.get('/orders/:userId/received', ordersController.getReceivedOrderBooks, (req, res) => {  // Changed to /orders/:userId/received
  console.log(`${res.result.receivedBooks} --------`);
  return res.status(200).json(res.result.receivedBooks);
});

// POST /books/search/user - Search for books a user owns or has borrowed
router.post('/books/search/user', booksController.searchUserBook, (req, res) => {  // Renamed to /books/search/user for better clarity
  console.log(`${res.result.searchResult} --------`);
  return res.status(200).json(res.result.searchResult);
});

router.delete('/books/:users_books_id', booksController.deleteBook, (req, res) => {
  console.log(`${res.result.deletedBookData}`);
  return res.status(200).json(res.result.deletedBookData);
});

router.get('/books/user/:userId', booksController.findMyBookList, (req, res) => {
  return res.status(200).json(res.locals.mybooks);
});

module.exports = router;