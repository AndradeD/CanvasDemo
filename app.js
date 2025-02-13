var express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path');
//var jsforce        = require('jsforce');
var app = express();
var crypto = require("crypto");
var consumerSecretApp = process.env.CANVAS_CONSUMER_SECRET || 'CF4D8739033F8AF584D7411C292102936B2989DBC1C0785A1441292E404799D9';

console.log('consumer secret - '+consumerSecretApp);

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

var cases = []

app.get('/', function (req, res) {
    res.render('index', {title: '', req: null, casesFromServer: JSON.stringify(cases)});
});

app.post('/', function (req, res) { 
  var bodyArray = req.body.signed_request.split(".");
    var consumerSecret = bodyArray[0];
    var encoded_envelope = bodyArray[1];

    var check = crypto.createHmac("sha256", consumerSecretApp).update(encoded_envelope).digest("base64");

    if (check === consumerSecret) { 
        var envelope = JSON.parse(new Buffer(encoded_envelope, "base64").toString("ascii"));
        //req.session.salesforce = envelope;
        console.log("got the session object:");
        console.log(envelope);
        console.log(JSON.stringify(envelope) );
        res.render('index', { title: envelope.context.user.userName, req : JSON.stringify(envelope), casesFromServer: JSON.stringify(cases)});
    }else{
        res.send("authentication failed");
    } 
})
 
app.listen(process.env.PORT || 3000 , function () {
	console.log ("server is listening!!!");
} );
