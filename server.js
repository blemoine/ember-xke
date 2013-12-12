var express = require('express');
var RSVP = require('rsvp');
var fs = require('fs');
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

// list of ponies
app.get('/ponies', function(req, res) {
  var id, ponyInArray = [];
  for (id in ponies){
    ponyInArray.push(ponies[id]);
  }

  res.send({ 'ponies': ponyInArray });
});

// get pony by id
app.get('/ponies/:id', function(req, res) {
  res.send({ 'pony': ponies[req.params.id] });
});

// new pony
app.post('/ponies', function(req, res) {
  console.log("req -->" + req);
  if (!!req.body.pony.id && !ponies[req.body.pony.id]){
    ponies[req.body.pony.id] = req.body.pony;
    res.send("ok");
  }
  res.send("ko");
});

// update pony
app.put('/ponies/:id', function(req, res) {
  if (!!req.body.id && ponies[req.body.id]){
    ponies[req.body.id] = req.body;
    res.send("ok");
  }
  res.send("ko");
});

// delete pony
app.delete('/ponies/:id', function(req, res) {
  if (!!req.params.id && ponies[req.params.id]){
    delete ponies[req.params.id];
    res.send("ok");
  }
  res.send("ko");
});

app.get('/templates.js', function(req, res) {
  fs.readdir('templates', function(err, files) {
    if (err) { res.send(err); }

    files = files.map(function(filename) {
      return new RSVP.Promise(function(resolve, reject) {
        fs.readFile('templates/' + filename, { encoding: 'utf-8' }, function(err, text) {
          if (err) { reject(err); }

          resolve({
            name: filename.replace(/\.hbs$/, ''),
            template: text
          });
        });
      });
    });

    RSVP.all(files).then(function(templates) {
      templates = templates.map(function(data) {
        data.template = JSON.stringify(data.template);
        return 'Em.TEMPLATES["' + data.name + '"] = Em.Handlebars.compile(' +
          data.template + ');\nTEMPLATES["' + data.name + '"] = ' +
          data.template + ';';
      });
      res.send('TEMPLATES = {};\n' + templates.join('\n'));
    }, function(err) {
      res.send(err);
    });
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port + '...');
