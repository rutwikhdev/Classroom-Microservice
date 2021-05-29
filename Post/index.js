const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const {randomBytes} = require('crypto');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var url = 'mongodb://localhost:27017'

app.post('/create_post', async (req, res) => {
    const id = randomBytes(6).toString('hex');
    const { classId, postTitle } = req.body;
    const newPost = { id: id, title: postTitle, comments: [] }
    
    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('posts').updateOne(
            { 'classId': classId },
            { $push: { 'data': newPost } }
        )

        db.close();
    });

    await axios.post('http://localhost:4009/events', {
        type: 'PostCreated',
        data: 'postid'
    });

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('posts').find({ classId: classId }).toArray((err, resp) => {
            if (err) throw err;
            res.status(200).send(resp.data);
        });
        
        db.close();
    });
})

app.post('/add_comment', async (req, res) => {
    const data = req.body;

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('posts').updateOne(
            { 'classId': data.class, 'data.id': data.id },
            { '$push': 
                { 'data.$.comments': data.text } 
            }
        );

        db.close();
    })

    console.log(posts[data.class]);
})

app.get('/get_posts/:id', async (req, res) => {
    const classId = req.params.id;

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('posts').find({ classId: classId }).toArray((err, resp) => {
            if (err) throw err;
            console.log(resp)
            res.status(200).send(resp[0].data);
        });

        db.close();
    });
})

app.post('/events', async (req, res) => {
    const event = req.body;
    console.log('Received event:', event.type);

    if (event.type == 'ClassCreated') {
        await MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db('ClassroomMS');

            dbo.collection('posts').insertOne({ classId: event.data, data: [] })
        });
    }

    res.send({});
})


app.listen(4002, () => {
    console.log('Post service listening on port 4002...');
})
