//imports
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

let newItems = [];

//Set static folder
app.use(express.static('public'));

//bodyparser
app.use(express.urlencoded({ extended: true }));

//EJS
app.set('view engine', 'ejs');

//GET
app.get('/', (req, res) => {
  let today = new Date();

  let option = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  let day = today.toLocaleDateString('en-US', option);

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
