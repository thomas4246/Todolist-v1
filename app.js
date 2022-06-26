//imports
const express = require('express');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

const newItems = [];

//setup DB connection
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/todolistDB');
}

//Item schema
const itemsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name for the item.'],
  },
});

//Items collection
const item = mongoose.model('item', itemsSchema);

//Create some todo for the Items collection
const todo1 = new item({
  name: 'Welcome to your todolist!',
});
const todo2 = new item({
  name: 'Hit the + button to add a new item',
});
const todo3 = new item({
  name: '<-- Hit this to delete an item',
});

//Insert default items into Items collection
const defaultItems = [todo1, todo2, todo3];

item.insertMany(defaultItems, (err) =>
  err
    ? console.log(err)
    : console.log('Successfully added the items to the Items collection')
);

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
