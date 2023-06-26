const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = 3000;
const CORS_CLIENT_ADDRESS = 'http://localhost:63342';

const app = express();
const messages = [];

app.use(bodyParser.json());

const corsOptions = {
  origin: CORS_CLIENT_ADDRESS,
  optionsSuccessStatus: 200
}


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.post('/messages', (req, res) => {
  const id = messages.length;

  messages.push({
    id: id,
    user: req.body.user,
    message: req.body.message
  });

  res.status(200).send(messages);
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));