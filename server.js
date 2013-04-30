var express = require('express');


var app = express();

app.configure(function () {
    app.use(express.bodyParser());
});

var poneys = {
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


// list of poney
app.get('/ponys', function(req, res) {
    var ponyInArray = [];
    for (var userId in poneys){
        ponyInArray.push(poneys[userId])
    }

    res.send({'ponys': ponyInArray});
});


// get poney by id
app.get('/ponys/:id', function(req, res) {
    res.send({'pony':poneys[req.params.id]});
});


// new pony
app.post('/ponys', function(req, res) {
    if (!!req.body.poney.id && poneys[req.body.poney.id] == null){
        poneys[req.body.poney.id] = req.body.poney;
        res.send("ok");
    }
    res.send("ko");
});


// update poney
app.put('/ponys/:id', function(req, res) {
    if (!!req.body.id && poneys[req.body.id] != null){
        poneys[req.body.id] = req.body;
        res.send("ok");
    }
    res.send("ko");
});

app.delete('/ponys/:id', function(req, res) {
    if (!!req.params.id && poneys[req.params.id] != null){
        delete poneys[req.params.id];
        res.send("ok");
    }
    res.send("ko");
});


app.listen(3000);
console.log('Listening on port 3000...');