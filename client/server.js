const express = require('express');
const path = require('path');

const app = express();
const SRC_DIR = path.resolve('dist');
const INDEX_PATH = path.join(SRC_DIR, 'index.html');
const PORT = 8000;

app.use(express.static(SRC_DIR));

app.get('*', (req, res) => res.sendFile(INDEX_PATH));

app.listen(PORT, () => console.log('Port 8000 listening'));
