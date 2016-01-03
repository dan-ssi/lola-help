var moment = require('moment');

require('cloud/app.js');

Parse.Cloud.afterSave("CallEvent",function(request) {
	var randomNumber = getRandom();
	Parse.Cloud.httpRequest({
	  method: 'PUT',
	  url: 'https://lola-help.firebaseio.com/.json',
	  body: {
	    callEvents: randomNumber
	  }
	}).then(function(httpResponse) {
	  console.log(httpResponse.text);
	}, function(httpResponse) {
	  console.error('Request failed with response code ' + httpResponse.status);
	});
});

// var Story = Parse.Object.extend("Story");
// var Metadata = Parse.Object.extend("Metadata");



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom() {
  return getRandomInt(getRandomInt(0,1000),getRandomInt(5000,100000));
}