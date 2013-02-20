var page = require('webpage').create(),
	server = require('webServer').create(),
	fs = require('fs');
	
page.open('http://localhost:30000/', funcrion(){
	return function(status){
		console.log(status);
		
		phantom.exit();
	}
})