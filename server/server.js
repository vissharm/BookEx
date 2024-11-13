const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = 3000;
const app = express();

const apiRouter = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/api', apiRouter);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

// app.use("*", (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err || err.message || "Internal Server Error!" });
});

app.listen(PORT, () => {
  console.log(`BOOKEX APP SERVER started listening on ${PORT}`);
});

module.exports = app;