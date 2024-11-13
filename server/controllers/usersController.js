const db = require('../models/databaseClient');
const usersController = {};
const bcrypt = require('bcrypt');
const emailController = require('./emailController');

usersController.createUser = (req, res, next) => {
  const { name, username, password, email, phone, address } = req.body;
  bcrypt.hash(password, 12)
  .then((hash) => {
      const query = `INSERT INTO users ("name", "username", "password", "email", "phone", "address") VALUES ($1, $2, $3, $4, $5, $6) RETURNING name, user_id, username, email, phone, address`;
      const values = [name, username, hash, email, phone, address];
      db.query(query, values)
        .then((sqlRes) => {
          res.locals.user = sqlRes.rows[0];
          res.locals.loggedIn = true;
          next()
        })
        .catch((err) => {
          console.log(err)
          next(err);
        });
    }
  )
  .catch(err => {
    return next("error hashing password")
  })
}

usersController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  const query1 = `SELECT password FROM users WHERE username = $1`;
  const values1 = [username];
  
  db.query(query1, values1)
    .then(sqlRes => {
      const hash = sqlRes.rows[0].password;
      bcrypt.compare(password, hash)
        .then(result => {
          console.log('hash result ' + result)
          if (result) {
            const query2 = `SELECT user_id, username, name, email, phone, address FROM users WHERE username = $1`;
            const values2 = [username];
          
            db.query(query2, values2)
              .then((verifiedUser) => {
                res.locals.user = verifiedUser.rows[0];
                res.locals.email = verifiedUser.rows[2];
                console.log(verifiedUser)
                res.locals.loggedIn = true;
                next();
              })
               .catch(err => {
                const errObj = {
                  log: err,
                  message: { Error: 'Login Failed' }
                }
                next(errObj)
              })
          } else {
            res.locals.loggedIn = false;
            res.locals.user = {user_id: 'imnotreal'};
            res.locals.email = {email: 'unauthorized user'}
            next();
          }
        })
        .catch(error => {
          return next(`Error in password encryption ${error}`)
        })
    })
    .catch(err => {
      return next(`username or password not found ${err}`)
    })

}

usersController.checkUsernameAvailability = (req, res, next) => {
  const {username} = req.query
  db.query(`SELECT username FROM users WHERE username = '${username.trim()}'`)
    .then(users =>{
      res.result = {available: users.rows?.length === 0};
      console.log(users);
      next();
    })
    .catch(err => {
      console.log(err);
      return next(err);
    })
}

usersController.checkEmailAvailability = (req, res, next) => {
  const {email} = req.query
  db.query(`SELECT email FROM users WHERE email = '${email.trim()}'`)
    .then(users =>{
      res.result = {available: users.rows?.length === 0};
      console.log(users);
      next();
    })
    .catch(err => {
      console.log(err);
      return next(err);
    })
}

usersController.checkContactAvailability = (req, res, next) => {
  const {phone} = req.query
  db.query(`SELECT phone FROM users WHERE phone = '${phone.trim()}'`)
    .then(users =>{
      res.result = {available: users.rows?.length === 0};
      console.log(users);
      next();
    })
    .catch(err => {
      console.log(err);
      return next(err);
    })
}

usersController.updateProfile = async (req, res, next) => {
  const {email, password, user_id} = req.body;
  const fieldsToUpdate = [];
  const values = [];

  let index = 0;
  let updatedText = ''
  if (email) {
    fieldsToUpdate.push(`email = $${++index}`);
    values.push(email);
    updatedText = `Email: ${email} `;
  }
  let encryptedPwd = '';
  if (password) {
      const salt = await bcrypt.genSalt(10);
      await bcrypt.hash(password, salt)
        .then((hash) => {
          encryptedPwd = hash;
        })
        .catch((err) => {
          console.log(err);
        })
      
    if (encryptedPwd) {
      fieldsToUpdate.push(`password = $${++index}`);
      values.push(encryptedPwd);
    }
    updatedText = `${updatedText ? `${updatedText} & Password:` + encryptedPwd : `Password: ${encryptedPwd}`}`;
  }

  const query = `
    UPDATE users
    SET ${fieldsToUpdate.join(', ')}
    WHERE user_id = $${++index} RETURNING user_id, email, phone, username, name, address;`;
  
    values.push(user_id);

  db.query(query, values)
    .then((data) => {
      if (!res.result) {
        res.result = {};
      }
      res.result.user = data.rows[0];

      if (updatedText.length) {
        const {email, password, user_id} = req.body;
        const emailData = { 
          to: email,
          subject: 'Profile update notification',
          text: `${updatedText} is changed. If you have not updated the ${updatedText}, please notify support and change/reset it immediately.`
        };

        req.body = {
          username: res.result?.user[0]?.username,
          email,
          ... emailData
        }

        if (password && encryptedPwd) {
          req.customData = {};
          req.customData.password = encryptedPwd;
        }

        emailController.sendEmail(req, res);
      }

      next();
    })
    .catch((err) => {
      console.log(err)
      return next(err)
    });
}

function generateSecurePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  // Generate the password by picking random characters from the charset
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

usersController.resetPassword = async (req, res, next) => {
  const {email, username} = req.body;
  const query1 = `SELECT user_id FROM users WHERE username = $1 and email = $2`;
  const values1 = [username, email];
  db.query(query1, values1)
    .then(async sqlRes => {
      console.log(sqlRes)
      console.log('.........................');
      var encryptedPwd = null;
      if (sqlRes.rows.length === 0) {
        res.locals.error = 'Username or Email is invalid. Please enter correct details.'
        res.status(500).json({ error: res.locals.error || err.message || "Internal Server Error!" });
      }
      var user_id = sqlRes.rows[0].user_id;
      const salt = await bcrypt.genSalt(10);
      var password = generateSecurePassword(12);
      await bcrypt.hash(password, salt)
        .then((hash) => {
          console.log(hash);
          console.log(user_id);
          encryptedPwd = password;
          console.log(encryptedPwd)
          if (!req.customData) {
            req.customData = {};
          }  
          req.customData.password = encryptedPwd;
          const query = `UPDATE users SET password = $1 WHERE users.user_id = $2`;
          const values = [hash, user_id];
          db.query(query, values)
            .then((data) => {
              console.log(data);
              console.log(hash);
              res.locals.result = 'success';
            })
            .catch((err) => {
              return next(err)
              console.log(err)
            });
        });
      console.log('----------------');
    })
    .then(res => {
      next();
    })
    .catch(err => {
      return next(err)
    });
  };


module.exports = usersController;