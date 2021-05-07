var express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path');
//var jsforce        = require('jsforce');
var app = express();
var crypto = require("crypto");
var consumerSecretApp = process.env.CANVAS_CONSUMER_SECRET || '7F1D62DFA69EFAA7086979BE0D9E0D21CB21AD8F93D6494A21812CC61781203B';

console.log('consumer secret - '+consumerSecretApp);

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
//teste

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
 

app.get('/', function (req, res) {
  /*var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    // loginUrl : 'https://test.salesforce.com'
  });
  var username = 'yourusername';
  var password = 'yourpassword+securitytoken';
  conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
    */
    //res.render('hello');
    res.render('index', {title: '', req: null});
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
        res.render('index', { title: envelope.context.user.userName, req : JSON.stringify(envelope) });
    }else{
        res.send("authentication failed");
    } 
})
 
app.listen(process.env.PORT || 3000 , function () {
	console.log ("server is listening!!!");
} );