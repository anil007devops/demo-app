var express = require('express'),
    server = express(),
    pub = __dirname + '/static/',
    views = __dirname + '/views';


var db;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://cdpneighbors:zzmmakq0@ds151117.mlab.com:51117/cme', (err, database) => {
  if (err) return console.log(err);
  db = database;
  var collection = db.collection('ephone');
  var user1 = {name: 'test', age: '111'};
  collection.insert([user1], function (err,res){
    if (err){
      console.log(err);
    }
    else {
      console.log("inserted");
    }
  });
  server.listen(9999, () => {
    console.log('listening on 9999')
  })
})

server.use(express.static(pub));




server.post('/convert', function (req, res) {
	var sccp = req.body.sccp;
});

server.get('/', function (req, res) {

    res.render('index.html');
});

//server.listen(process.env.PORT || 9999);
