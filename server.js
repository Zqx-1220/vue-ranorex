
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/readJson', (req, res) => {
  fs.readFile('Menu_output.json', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Error reading JSON file');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post('/writeJson', (req, res) => {
  const jsonData = req.body;
  fs.writeFile('Menu_output.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
      res.status(500).send('Error writing JSON file');
      return;
    }
    res.send('JSON file written successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
