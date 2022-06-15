//imports
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//bodyparser
app.use(express.json());

//GET
app.get('/', (req, res) => {
  res.send('hi');
});

//listen
app.listen(port, (req, res) =>
  console.log(`The server is online on the port ${port}`)
);
