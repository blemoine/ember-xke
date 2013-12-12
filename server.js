var express = require('express');


var app = express();

app.configure(function () {
    app.use(express.bodyParser());
});

var ponies = {
    1: {
        id: 1,
        first_name: 'Rainbow',
        last_name: 'Dash',
        color: 'Sky blue',
        type: 'Pegasus'
    },
    2: {
        id: 2,
        first_name: 'Twillight',
        last_name: 'Sparkle',
        color: 'Lavender',
        type: 'Alicorn'
    },
    3: {
        id: 3,
        first_name: 'Apple',
        last_name: 'Jack',
        color: 'orange',
        type: 'Earth Pony'
    }
};


app.use(express.static(__dirname));


// list of pony
app.get('/ponys', function(req, res) {
    var ponyInArray = [];
    for (var userId in ponies){
        ponyInArray.push(ponies[userId])
    }

    res.send({'ponys': ponyInArray});
});


// get pony by id
app.get('/ponys/:id', function(req, res) {
    res.send({'pony':ponies[req.params.id]});
});


// new pony
app.post('/ponys', function(req, res) {
    console.log("req -->" + req);
    if (!!req.body.pony.id && ponies[req.body.pony.id] == null){
        ponies[req.body.pony.id] = req.body.pony;
        res.send("ok");
    }
    res.send("ko");
});


// update pony
app.put('/ponys/:id', function(req, res) {
    if (!!req.body.id && ponies[req.body.id] != null){
        ponies[req.body.id] = req.body;
        res.send("ok");
    }
    res.send("ko");
});

app.delete('/ponys/:id', function(req, res) {
    if (!!req.params.id && ponies[req.params.id] != null){
        delete ponies[req.params.id];
        res.send("ok");
    }
    res.send("ko");
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port + '...');
