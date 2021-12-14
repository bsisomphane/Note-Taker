const fs = require('fs');
const express = require('express');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const { Console } = require('console');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','notes.html'));
  });
  // Adding note functions
app.get('/api/notes', (req, res) => {
  let notes= JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
  });
  // Make note
  app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid.v4()
    };
   let notes= JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notes.push(newNote); 
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
      res.json(notes);
  });

// Delete note
  app.delete(`/api/notes/:id`, (req,res) => {
    let notes= JSON.parse(fs.readFileSync("./db/db.json","utf8"));
    notes = notes.filter(notes=> notes.id.toString()!== req.params.id.toString());
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null,2));
      res.json(notes);
 });

 app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'));
}); 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });