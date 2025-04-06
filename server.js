const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('donate.db');
db.run(`CREATE TABLE IF NOT EXISTS donate (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  amount TEXT,
  msg TEXT,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/donate', (req, res) => {
  const { name, amount, msg } = req.body;
  db.run(`INSERT INTO donate (name, amount, msg) VALUES (?, ?, ?)`,
    [name, amount, msg], (err) => {
      if (err) return res.status(500).send("Error");
      res.send("OK");
    });
});

app.get('/latest', (req, res) => {
  db.get(`SELECT * FROM donate ORDER BY id DESC LIMIT 1`, (err, row) => {
    if (err) return res.status(500).send("Error");
    res.json(row || {});
  });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
