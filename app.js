//imports
const express = require('express');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

//Set static folder
app.use(express.static('public'));

//bodyparser
app.use(express.urlencoded({ extended: true }));

//EJS
app.set('view engine', 'ejs');

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

const defaultItems = [todo1, todo2, todo3];

//List schema
const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const list = mongoose.model('list', listSchema);

const day = date.getDate();
//GET
app.get('/', (req, res) => {
  //Insert defualt todos when the nothing in the list.
  item.find({}, (err, foundItems) =>
    foundItems.length === 0
      ? item.insertMany(defaultItems, (err) => {
          err
            ? console.log(err)
            : console.log(
                'Successfully added the default items to the Items collection'
              );
          res.redirect('/');
        })
      : res.render('index', { title: day, newTodo: foundItems })
  );
});

//GET dynamic route
app.get('/:listName', (req, res) => {
  // capitlized the first letter
  let listName = req.params.listName;
  listName = listName.charAt(0).toUpperCase() + listName.slice(1);

  // checking if the list is already exist
  list.findOne({ name: listName }, (err, foundList) => {
    if (err) {
      console.log(err);
    }
    if (!foundList) {
      // create a new list
      const newList = new list({
        name: listName,
        items: defaultItems,
      });

      newList.save();
      res.redirect('/' + listName);
    } else {
      // show the existing list
      res.render('index', { title: foundList.name, newTodo: foundList.items });
    }
  });
});

//POST
app.post('/', (req, res) => {
  const itemName = req.body.todo;
  const listName = req.body.button;

  const newTodo = new item({
    name: itemName,
  });

  if (listName == day) {
    newTodo.save();
    res.redirect('/');
  } else {
    // adding new items to the custom routes
    list.findOne({ name: listName }, (err, foundList) => {
      if (!err) {
        foundList.items.push(newTodo);
        foundList.save();
        res.redirect('/' + listName);
      }
    });
  }
});

//POST /delete
app.post('/delete', (req, res) => {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == day) {
    // check if it's on the "/" route
    item.findByIdAndRemove(checkedItem, (err) => {
      if (!err) {
        console.log('Succeefully deleted the item from the list.');
      }
    });
    res.redirect('/');
  } else {
    // if it's on a custom route
    list.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItem } } },
      (err, foundList) => {
        if (!err) {
          res.redirect('/' + listName);
        }
      }
    );
  }
});

//listen
app.listen(port, (req, res) =>
  console.log(`The server is online on the port ${port}`)
);
