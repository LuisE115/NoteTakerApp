const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
// Unique id helper
const uuid = require('./helpers/uuid');
// HEROKU PORT 
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// Display index.html file
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);
// Display notes.html file when entering .../notes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});


// Api to get all notes from the db
app.get('/api/notes', (req, res) => {
  res.json(notes);
})

// Api to create a new note and write it into the db
app.post('/api/notes', (req, res) => {

  const newNote = {
    title: req.body.title,
    text: req.body.text,
    // get an unique id using npm package uuid
    id: uuid(),
  };
  notes.push(newNote);
  fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err => {
    console.log(err);
  }))
  res.json(notes);
})

// Api to delete a note from the db
app.delete('api/notes/:id', (req, res) => {
  const deleteNote = req.params.id;
  console.log(deleteNote);
  notes.filter(not => not.id !== deleteNote)

  fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err => {
    console.log(err);
  }))
  res.json(notes);
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);
