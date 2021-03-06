
// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();

var CallEvent = Parse.Object.extend("CallEvent");
var phoneBook = Parse.Object.extend("phoneBook");


// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});


app.post('/callEventSub', function(req, res) {
// 	{"eventNotification": {
//     "callSessionIdentifier": "b6789123-abcd-1234-5678-abcdef12345",
//     "calledParticipant": "sip:+16305551212@foundry.att.com",
//     "callingParticipant": "sip:+15555550102@foundry.att.com",
//     "callingParticipantName": "Peter E. Xample",
//     "eventDescription": {"callEvent": "Busy"},
//     "rel": "callEventSubscription",
//     "notificationType": "CallEvent",
//     "reference": "+16305551212@192ec0d7",
//     "responseFrom": ""
// }}
	var callEvent = new CallEvent();
	callEvent.set('metadata', req.body.eventNotification);
	callEvent.save().then(function(success) {
		res.send({});
	}, function(error) {
		console.error(error);
		res.send({});
	});
});


app.post('/callEvent', function(req, res) {
// 	{"eventNotification": {
//     "callSessionIdentifier": "b6789123-abcd-1234-5678-abcdef12345",
//     "calledParticipant": "sip:+16305551212@foundry.att.com",
//     "callingParticipant": "sip:+15555550102@foundry.att.com",
//     "callingParticipantName": "Peter E. Xample",
//     "eventDescription": {"callEvent": "Busy"},
//     "rel": "callEventSubscription",
//     "notificationType": "CallEvent",
//     "reference": "+16305551212@192ec0d7",
//     "responseFrom": ""
// }}
	var callEvent = new CallEvent();
	callEvent.set('metadata', req.body.eventNotification);
	callEvent.save().then(function(success) {
		var caller = req.body.eventNotification.callingParticipant;
		console.log(caller);
		console.log("calling");
		var testNumber = new Parse.Query(phoneBook);
		testNumber.equalTo('phoneNumber', caller);
		testNumber.equalTo('blocked', true);
		testNumber.find().then(function(results) {
			if (results.length > 0) {
				// The number should be blocked by our app
				success.set('blocked', true);
				success.save().then(function(result) {
					res.send({ "action": {
						    "actionToPerform": "EndCall"
							}
					});
				}, function(error) {
					res.send({ "action": {
						    "actionToPerform": "EndCall"
							}
					});
				});
				
			} else {
				// test the number against white pages
				var testPhone = caller.replace('@foundry.att.net','');
				testPhone = testPhone.replace('sip:+','');
				Parse.Cloud.httpRequest({
				  method: 'GET',
				  url: 'https://proapi.whitepages.com/2.1/phone.json?api_key=842b93fe3fbbfdeb27fcc2e3d515a1cd&phone_number='+testPhone
				}).then(function(httpResponse) {
					success.set('whitepagesResponse', httpResponse.data);
					var level = httpResponse.data.results[0].reputation.level;
					var shouldBlock = level > 2;
					success.set('blocked', shouldBlock);
					success.save().then(function(result) {
					if (shouldBlock) {
						res.send({ "action": {
								    "actionToPerform": "EndCall"
								}
						});
					} else {
						res.send({});
					}
					})
					console.log(httpResponse.text);
					
				}, function(httpResponse) {
				  console.error('Whitepages Request failed with response code ' + httpResponse.status);
				  res.send({});
				});
			}
		}, function(Error) {
			res.send({});
		});
	}, function(error) {
		console.error(error);
		res.send({});
	});
});



// https://proapi.whitepages.com/2.1/phone.json?api_key=842b93fe3fbbfdeb27fcc2e3d515a1cd&phone_number=9991113230

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
