const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var Users = [];

app.post('/signup', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { email, password } = req.body;

    Users.filter(() => {
        if (Users.email === email) {
            res.render('signup', { message: 'User already exists!' });
        }
    });

    var newUser = { id: id, email: email, password: password };
    Users.push(newUser);

    await axios.post('http://localhost:4009/events', {
        type: 'UserCreated',
        data: {
            id, email
        }
    });

    res.status(201).send('User signed up');
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    Users.filter((user) => {
        if (user.email == email && user.password == password) {
            console.log('Successful login');
            res.status(200).send(user.id);
        } else {
            console.log('Unsuccessful login');
            res.status(401);
        }
    });
})

app.post('/events', (req, res) => {
  console.log('Received event:', req.body.type);

  res.send({});
})

app.listen(4000, () => {
    console.log('Authentication Server listening at port 4000...');
})
