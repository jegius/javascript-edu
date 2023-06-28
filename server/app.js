const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = 3000;
const CORS_CLIENT_ADDRESS = 'http://localhost:63342';

const app = express();
const messages = [];
const users = [];

app.use(bodyParser.json());

const corsOptions = {
  origin: CORS_CLIENT_ADDRESS,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// User controller
const userController = {
  createUser: (req, res) => {
    users.push(req.body);
    res.status(200).send(users);
  },
  getUsers: (req, res) => {
    res.json(users);
  },
  authorize: (req, res) => {

  }
};

// Message controller
const messageController = {
  createMessage: (req, res) => {
    const { user, message, id } = req.body;

    messages.push({
      id,
      user,
      message,
    });

    res.status(200).send(messages);
  },
  getMessages: (req, res) => {
    res.json(messages);
  },
};

// Routes
app.post("/users", userController.createUser);
app.get("/users", userController.getUsers);
app.get("/authorize", userController.authorize);

app.post("/messages", messageController.createMessage);
app.get("/messages", messageController.getMessages);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));