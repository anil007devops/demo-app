var express = require('express'),
    server = express(),
    bodyParser = require('body-parser'),
    pub = __dirname + '/static/';
//    sccp2sip;


//try {
//    sccp2sip = require('sccp2sip');
//} catch (err) {
//    console.log('Failure to load \'sccp2sip\' module');
//    sccp2sip = require('sccp2sip')
//}

//    views = __dirname + '/views';

//only thing this is doing is telling node to look in /static and use normal
//html rules for index.html as default webpage
//from there index calls app.js and that does all the work, but its client side
//need to figure out how to make the post go here instead

  server.listen(9999, () => {
    console.log('listening on 9999')
  })


server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static(pub));

server.post('/convert', function (req, res) {
	var sccp = req.body.sccp;
//  var sip = JSON.stringify({a:1,b:2,c:{d:1,e:[1,2]}});
//  sccp2sip.convertSccp(sccp, {}, function (err, sip) {
  req.json({ sccp: sccp });


//});
});

server.get('/', function (req, res) {
    res.render('index.html');
});


var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('./static/file.txt');
	lr.on('error', function (err) {
		// 'err' contains error object
	});

	lr.on('line', function (line) {
		// 'line' contains the current line without the trailing newline character.
		//console.log(line);
	});

	lr.on('end', function () {
		// All lines are read, file is closed now.
	});
//server.listen(process.env.PORT || 9999);
