const db = require('../models/databaseClient');
const ordersController = {};

ordersController.getOrderedBooks = (req, res, next) => {
    console.log('called... | |');
    const {userId} = req.params;
    const query = `SELECT books.id, books.author, books.isbn, books.title, books.genre, users.username, users.name, users.email,
    users_books.users_books_id, users_books.requester, users_books.request_type, users_books.request_date, users_books.request_days,
    users_books.rent_price, users_books.request_approved, users_books.request_approved_date, users_books.requester_comment, users_books.owner_comment,
    users_books.user_received_status, users_books.user_received_date, users_books.user_ship_status, users_books.user_ship_date,
    users_books.requester_ship_date, users_books.requester_ship_status, users_books.requester_received_status, users_books.requester_received_date
    FROM users
    JOIN users_books
    ON users.user_id = users_books.user_id
    JOIN books
    ON users_books.bookISBN = books.isbn
    WHERE users_books.user_id != ${userId} AND users_books.requester = ${userId}`;
    // WHERE users_books.user_id != ${userId} AND (users_books.requester IS NULL OR users_books.requester = '') AND title ~* '\\y${keyword}\\y'`;
    console.log(query);
    db.query(query)
      .then((data) => {
        res.result ={};
        res.result.orderedBooks = data.rows;
        next();
      })
      .catch((err) => {
        console.log(err)
        next(err);
      });
  }
  
  ordersController.getReceivedOrderBooks = (req, res, next) => {
    console.log('called...');
    const {userId} = req.params;
    const query = `SELECT books.id, books.author, books.isbn, books.title, books.genre, users.username, users.name, users.email,
    users_books.users_books_id, users_books.requester, users_books.request_type, users_books.request_date, users_books.request_days,
    users_books.rent_price, users_books.request_approved, users_books.request_approved_date, users_books.requester_comment, users_books.owner_comment,
    users_books.user_received_status, users_books.user_received_date, users_books.user_ship_status, users_books.user_ship_date,
    users_books.requester_ship_date, users_books.requester_ship_status, users_books.requester_received_status, users_books.requester_received_date
    FROM users
    JOIN users_books
    ON users.user_id = users_books.user_id
    JOIN books
    ON users_books.bookISBN = books.isbn
    WHERE users_books.user_id = ${userId} AND (users_books.requester IS NOT NULL)`;
  
    db.query(query)
      .then((data) => {
        res.result ={};
        res.result.receivedBooks = data.rows
        next();
      })
      .catch((err) => {
        console.log(err)
        next(err);
      });
  }

  module.exports = ordersController;