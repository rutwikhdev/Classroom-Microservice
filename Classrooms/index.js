const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// when the user is created send the userId to evernt-bus -> classrom service recieve and add it to classes
classes = { 'user1id': ['class1id', 'class2id', 'class3id']}

app.post('/create_class', async (req, res) => {
    const classId = randomBytes(3).toString('hex');
    const { userId } = req.body;

    classes[userId].push(classId)
    console.log(classes);
    
    await axios.post('http://localhost:4009/events', {
        type: 'ClassCreated',
        data: classId
    });

    res.status(201).send('Class created');
});

app.post('/add_class', (req, res) => {
    res.status(202).send();
});

app.post('/get_classes/:id', (req, res) => {
    res.status(200).send(classes[req.params.id]);
});

app.post('/events', (req, res) => {
    console.log('Recieved event', req.body.type);
    // if event is userCreated then classes[userId] : []
    const { type, data } = req.body;
    if (type == 'UserCreated') {
        classes[data.id] = [];
    }
    console.log(classes);
    res.send({});
});


app.listen(4001, () => {
    console.log('Classroom service listening at port 4001...');
})
