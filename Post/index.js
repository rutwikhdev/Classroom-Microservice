const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const {randomBytes} = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

posts = {}

app.post('/post', (req, res) => {
    // create post for first time
    const { classId, title } = req.body;
    posts[classId].append({
        text: title, comments: [] 
    });

    res.status(200).send('PostCreated');
})

app.get('/post', (req, res) => {
    // return all posts
    res.status(200).send(posts);
})

app.post('/events', (req, res) => {
    const event = req.body;
    console.log('Received event:', event.type);

    if (event.type == 'ClassCreated') {
        posts[event.data] = [];
    }
    console.log(posts);
    res.send({});
})


app.listen(4002, () => {
    console.log('Post service listening on port 4002...');
})