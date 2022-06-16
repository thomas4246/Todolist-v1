//imports
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//bodyparser
app.use(express.json());

//EJS
app.set('view engine', 'ejs');

//GET
app.get('/', (req, res) => {
  let today = new Date();
  let currentDay = today.getDay();
  let day = '';

  switch (currentDay) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;
    default:
  }

  res.render('index', { day: day });
});

//listen
app.listen(port, (req, res) =>
  console.log(`The server is online on the port ${port}`)
);
