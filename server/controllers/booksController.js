const db = require('../models/databaseClient');
const booksController = {};
  
booksController.findMyBookList = async (req, res, next) => {
  const user_id = req.params.userId
  const query = `SELECT books.id, books.title, books.author, users_books.condition, books.isbn, books.genre, users_books.users_books_id, users_books.rent_price
  FROM users
  JOIN users_books
  ON users.user_id = users_books.user_id
  JOIN books
  ON users_books.bookISBN = books.isbn
  WHERE users.user_id = '${user_id}'`;

  await db.query(query)
    .then((data) => {
      res.locals.mybooks = data.rows;
      next();
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
}


booksController.findBookByIsbn = async (req, res, next) => {
  const isbn = req.params.isbn || req.body.isbn
  const query = `SELECT * FROM books WHERE isbn = '${isbn}'`;
  await db.query(query)
    .then((data) => {
      if (!res.result) {
        res.result = {};
      }
      res.result.bookData = data;
      next();
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
}

booksController.addBook = async (req, res, next) => {
  if (res.result.bookData && res.result.bookData.length > 0) {
    console.log(res.result.bookData);
    next();
  }

  const {author, genre, isbn, title} = req.body;
  const query = `
  INSERT INTO books ("isbn", "title", "author", "genre")
  VALUES ('${isbn}', '${title}', '${author}', '${genre}')
  RETURNING *`;
  await db.query(query)
    .then((data) => {
      console.log(data);
      res.result.bookData = data.rows[0];
      next();
    })
    .catch((err) => {
      console.log('catch');
      console.log(err);
      return next(err);
    });
};

booksController.addUserBook = async (req, res, next) => {
  const {isbn, condition, rent_price, user_id} = req.body;
  const query = `
  INSERT INTO users_books ("user_id", "bookisbn", "condition", "rent_price")
  VALUES ('${user_id}', '${isbn}', '${condition}', '${rent_price}')
  RETURNING *`;
  
  await db.query(query)
    .then((data) => {
      res.result.userBookData = {...data.rows[0], ...res.result.bookData};
      next();

    })
    .catch((err) => {
      next(err);
    });
};

booksController.updateBook = async (req, res, next) => {
  const {isbn, title, author, genre} = req.body;
  const query = `UPDATE books SET title='${title}' , author='${author}', genre='${genre}' WHERE books.isbn='${isbn}' RETURNING *`;
  await db.query(query)
    .then((data) => {
      if (!res.result) {
        res.result = {};
      }
      res.result.bookData = data.rows[0];
      next();
    })
    .catch((err) => {
      next(err);
    });
};

booksController.updateUserBook = async (req, res, next) => {
  const {isbn, condition, users_books_id, rent_price} = req.body;
  const query = `UPDATE users_books SET condition='${condition}', rent_price='${rent_price}' WHERE users_books.bookisbn='${isbn}' AND users_books.users_books_id=${users_books_id} RETURNING *`;
  await db.query(query)
    .then((data) => {
      res.result.userBookData = {...data.rows[0], ...res.result.bookData};
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

booksController.deleteBook = (req, res, next) => {
  const users_books_id = req.params.users_books_id;
  const query = `DELETE FROM users_books WHERE users_books_id = ${users_books_id} RETURNING *`;
  //CHANGE TO THIS LATER ONCE API WORKS AND WHAT RESULTS ARE ^^
  db.query(query)
    .then((data) => {
      if (!res.result) {
        res.result = {};
      }
      res.result.deletedBookData = {...data.rows[0]};
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}


booksController.searchUserBook = (req, res, next) => {
  const {keyword, criteria, userId} = req.body;
  const query = `SELECT books.id, books.author, books.isbn, books.title, books.genre, users.username, users.name, users.email,
  users_books.users_books_id, users_books.request_type, users_books.request_date, users_books.request_days,
  users_books.rent_price, users_books.request_approved, users_books.requester_comment, users_books.owner_comment
  FROM users
  JOIN users_books
  ON users.user_id = users_books.user_id
  JOIN books
  ON users_books.bookISBN = books.isbn
  WHERE users_books.user_id = ${userId} AND LOWER(books.${criteria}) like LOWER('%${keyword}%')`;
  // WHERE users_books.user_id != ${userId} AND (users_books.requester IS NULL OR users_books.requester = '') AND title ~* '\\y${keyword}\\y'`;

  db.query(query)
    .then((data) => {
      res.result ={};
      res.result.searchResult = data.rows;
      next();
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
}

booksController.searchBook = (req, res, next) => {
  const {keyword = '', criteria, userId} = req.body;

  var query = `SELECT books.id, books.author, books.isbn, books.title, books.genre,
  users.username, users.name, users.email, users.user_id, users_books.users_books_id, users_books.request_type, users_books.request_date, users_books.request_days,
  users_books.rent_price, users_books.request_approved, users_books.requester_comment, users_books.owner_comment
  FROM users
  JOIN users_books
  ON users.user_id = users_books.user_id
  JOIN books
  ON users_books.bookISBN = books.isbn
  WHERE users_books.user_id != $1  AND users_books.requester IS NULL`;

  const values = [userId];
  let paramIndex = 2;

  if (criteria) {
    query = `${query} AND LOWER(books.${criteria}) like LOWER($2)`;
    values.push(`%${keyword}%`);
    paramIndex++;
  }

  db.query(query, values)
    .then((data) => {
      res.result ={};
      res.result.searchResult = data.rows;
      next();
    })
    .catch((err) => {
      console.log(err)
      next(err);
    });
}

// booksController.getOrderedBooks = (req, res, next) => {
//   console.log('called... | |');
//   const {userId} = req.params;
//   const query = `SELECT books.id, books.author, books.isbn, books.title, books.genre, users.username, users.name, users.email,
//   users_books.users_books_id, users_books.requester, users_books.request_type, users_books.request_date, users_books.request_days,
//   users_books.rent_price, users_books.request_approved, users_books.request_approved_date, users_books.requester_comment, users_books.owner_comment,
//   users_books.user_received_status, users_books.user_received_date, users_books.user_ship_status, users_books.user_ship_date,
//   users_books.requester_ship_date, users_books.requester_ship_status, users_books.requester_received_status, users_books.requester_received_date
//   FROM users
//   JOIN users_books
//   ON users.user_id = users_books.user_id
//   JOIN books
//   ON users_books.bookISBN = books.isbn
//   WHERE users_books.user_id != ${userId} AND users_books.requester = ${userId}`;
//   // WHERE users_books.user_id != ${userId} AND (users_books.requester IS NULL OR users_books.requester = '') AND title ~* '\\y${keyword}\\y'`;
//   console.log(query);
//   db.query(query)
//     .then((data) => {
//       res.result ={};
//       res.result.orderedBooks = data.rows;
//       next();
//     })
//     .catch((err) => {
//       console.log(err)
//       next(err);
//     });
// }

// booksController.getReceivedOrderBooks = (req, res, next) => {
//   console.log('called...');
//   const {userId} = req.params;
//   const query = `SELECT books.id, books.author, books.isbn, books.title, books.genre, users.username, users.name, users.email,
//   users_books.users_books_id, users_books.requester, users_books.request_type, users_books.request_date, users_books.request_days,
//   users_books.rent_price, users_books.request_approved, users_books.request_approved_date, users_books.requester_comment, users_books.owner_comment,
//   users_books.user_received_status, users_books.user_received_date, users_books.user_ship_status, users_books.user_ship_date,
//   users_books.requester_ship_date, users_books.requester_ship_status, users_books.requester_received_status, users_books.requester_received_date
//   FROM users
//   JOIN users_books
//   ON users.user_id = users_books.user_id
//   JOIN books
//   ON users_books.bookISBN = books.isbn
//   WHERE users_books.user_id = ${userId} AND (users_books.requester IS NOT NULL)`;

//   db.query(query)
//     .then((data) => {
//       res.result ={};
//       res.result.receivedBooks = data.rows
//       next();
//     })
//     .catch((err) => {
//       console.log(err)
//       next(err);
//     });
// }

booksController.updateUserBookStatus = async (req, res, next) => {
  const {
    isbn,
    condition,
    users_books_id,
    requester,
    user_id,
    bookisbn,
    request_type,
    request_date,
    request_days,
    request_approved,
    request_approved_date,
    rent_price,
    requester_comment,
    owner_comment,
    user_received_status,
    user_received_date,
    user_ship_status,
    user_ship_date,
    requester_ship_date,
    requester_ship_status,
    requester_received_date,
    requester_received_status,
    cancelRequest = false
  } = req.body;

  const fieldsToUpdate = [];
  const values = [];

  let index = 0;
  if (condition) {
    fieldsToUpdate.push(`condition = $${++index}`);
    values.push(condition);
  }
  if (requester || cancelRequest) {
    if (cancelRequest) {
      fieldsToUpdate.push(`requester = NULL`);
    } else {
      fieldsToUpdate.push(`requester = $${++index}`);
      values.push(requester);
    }
  }
  if (bookisbn) {
    fieldsToUpdate.push(`bookisbn = $${++index}`);
    values.push(bookisbn);
  }
  if (request_type || cancelRequest) {
    fieldsToUpdate.push(`request_type = $${++index}`);
    values.push(request_type);
  }
  if (request_date || cancelRequest) {
    fieldsToUpdate.push(`request_date = $${++index}`);
    values.push(request_date);
  }
  if (request_days || cancelRequest) {
    if (cancelRequest) {
      fieldsToUpdate.push(`request_days = NULL`);
    } else {
      fieldsToUpdate.push(`request_days = $${++index}`);
      values.push(request_days);
    }
  }
  if (request_approved || cancelRequest) {
    fieldsToUpdate.push(`request_approved = $${++index}`);
    values.push(request_approved);
  }
  if (request_approved_date || cancelRequest) {
    fieldsToUpdate.push(`request_approved_date = $${++index}`);
    values.push(request_approved_date);
  }
  if (rent_price) {
    fieldsToUpdate.push(`rent_price = $${++index}`);
    values.push(rent_price);
  }
  if (requester_comment || cancelRequest) {
    const comment =  !cancelRequest ? `\n ${new Date().toISOString()}: ${requester_comment}` : requester_comment;
    fieldsToUpdate.push(`requester_comment = COALESCE(NULLIF(requester_comment, ''), '') || $${++index}`);
    values.push(comment);
  }
  if (owner_comment || cancelRequest) {
    const comment = !cancelRequest ? `\n ${new Date().toISOString()}: ${owner_comment}` : owner_comment;
    fieldsToUpdate.push(`owner_comment = COALESCE(NULLIF(owner_comment, ''), '') || $${++index}`);
    values.push(comment);
  }
  if (user_received_status || cancelRequest) {
    fieldsToUpdate.push(`user_received_status = $${++index}`);
    values.push(user_received_status);
  }
  if (user_received_date || cancelRequest) {
    fieldsToUpdate.push(`user_received_date = $${++index}`);
    values.push(user_received_date);
  }
  if (user_ship_status || cancelRequest) {
    fieldsToUpdate.push(`user_ship_status = $${++index}`);
    values.push(user_ship_status);
  }
  if (user_ship_date || cancelRequest) {
    fieldsToUpdate.push(`user_ship_date = $${++index}`);
    values.push(user_ship_date);
  }
  if (requester_ship_date || cancelRequest) {
    fieldsToUpdate.push(`requester_ship_date = $${++index}`);
    values.push(requester_ship_date);
  }
  if (requester_ship_status || cancelRequest) {
    fieldsToUpdate.push(`requester_ship_status = $${++index}`);
    values.push(requester_ship_status);
  }
  if (requester_received_status || cancelRequest) {
    fieldsToUpdate.push(`requester_received_status = $${++index}`);
    values.push(requester_received_status);
  }
  if (requester_received_date || cancelRequest) {
    fieldsToUpdate.push(`requester_received_date = $${++index}`);
    values.push(requester_received_date);
  }

  // Return early if there’s nothing to update
  if (fieldsToUpdate.length === 0) {
    return next(new Error('No valid fields provided for update.'));
  }

  try {
    if (cancelRequest) {
      const query = `INSERT INTO users_books_log (users_books_id, requester, user_id, bookisbn, condition, request_type, request_date, request_days,
      request_approved, rent_price, requester_comment, owner_comment, user_received_status, user_ship_status, user_ship_date, requester_ship_date,
      requester_ship_status, requester_received_status, requester_received_date, user_received_date, request_approved_date)
      SELECT users_books_id, requester, user_id, bookisbn, condition, request_type, request_date, request_days,
      request_approved, rent_price, requester_comment, owner_comment, user_received_status, user_ship_status, user_ship_date, requester_ship_date,
      requester_ship_status, requester_received_status, requester_received_date, user_received_date, request_approved_date
      FROM users_books WHERE users_books_id = ${users_books_id};`
      db.query(query)
        .catch((err) => {
          console.log(err);
        });
    }

    // Construct the final query string with the dynamic fields
    const query = `
    UPDATE users_books
    SET ${fieldsToUpdate.join(', ')}
    WHERE bookisbn = $${++index} AND users_books_id = $${++index}
    RETURNING *`;

    // Add the identifiers to the values array
    console.log(bookisbn);
    values.push(bookisbn, users_books_id);
    console.log(values.join(','));

    const data = await db.query(query, values);
    if (!res.result) {
      res.result = {};
    }

    res.result.updatedBookData = data.rows;

    if (user_received_status && user_received_date && !cancelRequest) {
      const query = `INSERT INTO users_books_log (users_books_id, requester, user_id, bookisbn, condition, request_type, request_date, request_days,
      request_approved, rent_price, requester_comment, owner_comment, user_received_status, user_ship_status, user_ship_date, requester_ship_date,
      requester_ship_status, requester_received_status, requester_received_date, user_received_date, request_approved_date)
      SELECT users_books_id, requester, user_id, bookisbn, condition, request_type, request_date, request_days,
      request_approved, rent_price, requester_comment, owner_comment, user_received_status, user_ship_status, user_ship_date, requester_ship_date,
      requester_ship_status, requester_received_status, requester_received_date, user_received_date, request_approved_date
      FROM users_books WHERE users_books_id = ${users_books_id};`
      db.query(query)
        .catch((err) => {
          console.log(err);
        });  
    }

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// booksController.requestBook = (req, res, next) => {
//   const user_id = req.body.userId;
//   const username = req.body.username;
//   const isbn = req.body.isbn;
//   // const user_id= req.cookies.ssid;
//   const query = `UPDATE users_books 
//   SET requester = ${user_id}
//   WHERE users_books.bookisbn = '${isbn}' AND users_books.user_id = (SELECT user_id FROM users WHERE users.username = '${username}')`;
//   // And where user ID equals to User ID of owner

//   db.query(query)
//     .then((data) => {
//       res.locals.requestBooks = data.rows;
//       next();
//     })
//     .catch((err) => {
//       console.log(err)
//       return next(err);
//     });
// }

module.exports = booksController;
