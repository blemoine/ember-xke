var express = require('express');


var app = express();

app.configure(function () {
    app.use(express.bodyParser());
});

var ponies = {
    1: {
        id: 1,
        firstName: 'Rainbow',
        lastName: 'Dash',
        color: 'Sky blue',
        type: 'Pegasus'
    },
    2: {
        id: 2,
        firstName: 'Twillight',
        lastName: 'Sparkle',
        color: 'Lavender',
        type: 'Alicorn'
    },
    3: {
        id: 3,
        firstName: 'Apple',
        lastName: 'Jack',
        color: 'orange',
        type: 'Earth Pony'
    }
};


app.use(express.static(__dirname));


// list of pony
app.get('/ponies', function(req, res) {
    var ponyInArray = [];
    for (var userId in ponies){
        ponyInArray.push(ponies[userId])
    }
    res.send(ponyInArray);
});


// get user by id
app.get('/ponies/:id', function(req, res) {
    res.send(ponies[req.params.id]);
});


// new user
app.post('/ponies', function(req, res) {
    if (!!req.body.id && ponies[req.body.id] == null){
        ponies[req.body.id] = req.body;
        res.send("ok");
    }
    res.send("ko");
});


// update pony
app.put('/ponies/:id', function(req, res) {
    if (!!req.body.id && ponies[req.body.id] != null){
        ponies[req.body.id] = req.body;
        res.send("ok");
    }
    res.send("ko");
});

app.delete('/ponies/:id', function(req, res) {
    if (!!req.params.id && ponies[req.params.id] != null){
        delete ponies[req.params.id];
        res.send("ok");
    }
    res.send("ko");
});


app.listen(3000);
console.log('Listening on port 3000...');