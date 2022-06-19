//imports
const express = require('express');
const date = require(__dirname + '/date.js');

const app = express();
const port = process.env.PORT || 3000;

const newItems = [];

//Set static folder
app.use(express.static('public'));

//bodyparser
app.use(express.urlencoded({ extended: true }));

//EJS
app.set('view engine', 'ejs');

//GET
app.get('/', (req, res) => {
  let day = date.getDate();
  res.render('index', { day: day, newTodo: newItems });
});

app.post('/', (req, res) => {
  let newItem = req.body.todo;

  newItem === ''
    ? console.error('It can not be blink')
    : newItems.push(newItem);

  res.redirect('/');
});

//listen
app.listen(port, (req, res) =>
  console.log(`The server is online on the port ${port}`)
);
