const { Pool } = require('pg');

var config = {
  user: 'postgres',
  database: 'test',
  password: 'password',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
const pool = new Pool(config);


module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
