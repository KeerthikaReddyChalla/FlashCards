const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '22071a66e1',
  database: 'cards_db'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.get('/cards', (req, res) => {
  const sql = 'SELECT * FROM cards_db';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching cards:', err);
      res.status(500).json({ error: 'An error occurred while fetching cards' });
    } else {
      res.json(results);
    }
  });
});

app.post('/cards', (req, res) => {
  const { Question, Answer } = req.body;
  const sql = 'INSERT INTO cards_db (Question, Answer) VALUES (?, ?)';
  db.query(sql, [Question, Answer], (err, results) => {
    if (err) {
      console.error('Error inserting card:', err);
      res.status(500).json({ error: 'An error occurred while adding the card' });
    } else {
      res.json({ id: results.insertId });
    }
  });
});

app.delete('/cards/:question', (req, res) => {
  const { question } = req.params;
  const sql = 'DELETE FROM cards_db WHERE Question = ?';
  db.query(sql, [question], (err) => {
    if (err) {
      console.error('Error deleting card:', err);
      res.status(500).json({ error: 'An error occurred while deleting the card' });
    } else {
      res.json({ success: true });
    }
  });
});

app.put('/cards/:question', (req, res) => {
  const { question } = req.params;
  const { Question, Answer } = req.body;
  const sql = 'UPDATE cards_db SET Question = ?, Answer = ? WHERE Question = ?';
  db.query(sql, [Question, Answer, question], (err) => {
    if (err) {
      console.error('Error updating card:', err);
      res.status(500).json({ error: 'An error occurred while updating the card' });
    } else {
      res.json({ success: true });
    }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
