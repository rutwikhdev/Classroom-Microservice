const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const {randomBytes} = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

posts = { 'classid1': [{ id: 'random(6)', title: 'post1', comments: ['comment1', 'comment2']}] };

app.post('/create_post', async (req, res) => {
    const id = randomBytes(6).toString('hex');
    const { classId, postTitle } = req.body;

    posts[classId].push({
        id: id, title: postTitle, comments: []
    });

    await axios.post('http://localhost:4009/events', {
        type: 'PostCreated',
        data: 'postid'
    });

    res.status(200).send(posts[classId]);
})

app.post('/add_comment', (req, res) => {
    const data = req.body;
    const arr = posts[data.class];

    for (i in arr) {
      if (arr[i].id == data.id) {
        arr[i]['comments'].push(data.text);
      }
    }
    console.log(posts[data.class]);
})

app.get('/get_posts/:id', (req, res) => {
    const classId = req.params.id;
    res.status(200).send(posts[classId]);
})

app.post('/events', (req, res) => {
    const event = req.body;
    console.log('Received event:', event.type);

    if (event.type == 'ClassCreated') {
        posts[event.data] = [];
    }

    res.send({});
})


app.listen(4002, () => {
    console.log('Post service listening on port 4002...');
})
