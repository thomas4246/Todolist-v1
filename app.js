//imports
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

//bodyparser
app.use(express.json());

//listen
app.listen(port, (req, res) =>
  console.log(`The server is online on the port ${port}`)
);
