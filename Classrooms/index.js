// classrom service has to on while user is being created
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var url = 'mongodb://localhost:27017/';

app.post('/create_class', async (req, res) => {
    const classId = randomBytes(3).toString('hex');
    const { userId, title } = req.body;
    const newClass = { id: classId, data: { classId: classId, title: title }}

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('user').updateOne(
            { 'id': userId }, 
            { $push: { 'class_list': classId } }
        );

        db.close();
    });

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('classes').insertOne(newClass, (err, res) => {
            if (err) throw err;
        });

        db.close();
    });

    await axios.post('http://localhost:4009/events', {
        type: 'ClassCreated',
        data: classId
    });

    res.status(201).send('Class created');
});

app.post('/add_class', async (req, res) => {
    const {userId, classId} = req.body;

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('user').updateOne(
            { 'id': userId },
            { $push: { 'class_list': classId } }
        );

        db.close();
    });

    res.status(202).send({});
});

app.get('/get_classes/:id', async (req, response) => {
    const userId = req.params.id;
    let resClassList = [];

    await MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db('ClassroomMS');

        dbo.collection('user').find({ id: userId }).toArray((err, res) => {
            if (err) throw err;
            const n = res[0].class_list.length;

            res[0].class_list.forEach((item, index) => {
                resolvePromise(dbo, item).then(resp => {
                    resClassList.push(resp[0].data);

                    if (resClassList.length == n) {
                        response.status(200).send({data: resClassList});
                    }
                });
            });

            db.close();
        });
    });
});

async function resolvePromise(dbo, x) {
    return await dbo.collection('classes').find({ id: x }).toArray();
}

app.post('/events', async (req, res) => {
    console.log('Recieved event', req.body.type);

    const { type, data } = req.body;

    if (type == 'UserCreated') {
        users[data.id] = [];
        await MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            var dbo = db.db('ClassroomMS');

            dbo.collection('user').insertOne({id: data.id, class_list: []}, (err, res) => {
                if (err) throw err;
                db.close();                
            });
        });
    }

    res.send({});
});


app.listen(4001, () => {
    console.log('Classroom service listening at port 4001...');
})
