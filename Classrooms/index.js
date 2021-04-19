const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

users = { 'user1id': ['class1id', 'class2id', 'class3id'] }
classes = { 'classid1': { classId: 'classid1', title: 'title1' } }

app.post('/create_class', async (req, res) => {
    const classId = randomBytes(3).toString('hex');
    const { userId, title } = req.body;

    users[userId].push(classId);
    classes[classId] = {classId: classId, title: title};

    await axios.post('http://localhost:4009/events', {
        type: 'ClassCreated',
        data: classId
    });

    res.status(201).send('Class created');
});

app.post('/add_class', (req, res) => {
    const {userId, classId} = req.body;

    if (Object.keys(classes).includes(classId)) {
        users[userId].push(classId);
    }

    res.status(202).send({});
});

app.get('/get_classes/:id', (req, res) => {
    // this won't work if classroom service goes down because then the userId data will be lost and the returning will be undefined.
    console.log('Users will refresh if classroom service goes down or reloaded: ',Object.keys(users));
    const userId = req.params.id;
    resClassList = [];
    const clist = users[userId];

    for (i in clist) {
        resClassList.push(classes[clist[i]]);
    }

    res.status(200).send({data: resClassList});
});

app.post('/events', (req, res) => {
    console.log('Recieved event', req.body.type);

    const { type, data } = req.body;

    if (type == 'UserCreated') {
        users[data.id] = [];
    }

    res.send({});
});


app.listen(4001, () => {
    console.log('Classroom service listening at port 4001...');
})
