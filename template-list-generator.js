var page = require('webpage').create(),
	system = require('system'),
	fs = require('fs'),
	completeObject = [],
	config = {
		url : system.args[1],
		page : "/template-list.html"
	};

if (system.args.length < 2) {
	console.log('Usage: server.js <some port>');
	phantom.exit(1);
}

function openLinks(links, i){

	console.log('openLinksMethod')

	if(i == links.length){
		finalize();
	}

	var link = links[i];

	if(link.href === undefined ){
		console.log('skip : ' + link.href)
//		fs.write('phantom/log/log.txt', 'Skip : ' + link.href + '\n', 'a');
		i++;
		openLinks(links, i);
		return true;
	}

	if(!/http/.test(link.href)){
		link.href = config.url + link.href;
//		fs.write('phantom/log/log.txt', 'Complete Link : ' + link.href + '\n', 'a');
	}

	/*if(link.href.indexOf(config.url) == -1 || config.url == link.href){
		console.log('skip : ' + link.href);
//		fs.write('phantom/log/log.txt', 'Skip : ' + link.href + '\n', 'a');
		i++;
		openLinks(links, i);
		return true;
	}*/

	console.log('Opening : ' + link.href);
	page.open(link.href, function(link, links, completeObject, i){
		return function(status){

			console.log('Open ' + status + ' on ' + link.href);
			if (status == 'success'){
				page.viewportSize = { width: 960};
				page.render('screenshots/link' + i +'.png');
				var tmpObj = {
					"link" : link.href,
					"text" : link.text,
					"cat" : link.cat,
					"render" : 'screenshots/link'+i+'.png'
				};

				completeObject.push(tmpObj);
			}

			page.release();
			page = require('webpage').create();
			i++;
			openLinks(links, i);

		}

	}(link, links, completeObject, i));
}

function finalize(){
	//Log registerObject
	console.log('Writing : finalObject.json');
	if(fs.isFile('finalObject.json')){
		fs.remove('finalObject.json');
	}
	fs.write('finalObject.json', JSON.stringify(completeObject), 'a');
	phantom.exit();
};


console.log('Starting template-list-generator on: '+system.args[1]);

page.open(config.url + config.page, function(status){
	if(status != 'success'){
		console.log('Impossible to open page')
		phantom.exit();
	}

	var links = page.evaluate(function(){
		var cat = document.querySelectorAll('div.category'),
			tmpLinks,
			catName,
			links = [];

		if (cat.length > 0){
			for (var i = 0; i < cat.length; i++) {
				catName = cat[i].getAttribute('data-category-name');
				tmpLinks = cat[i].querySelectorAll('a');

				for (var ii = 0; ii < tmpLinks.length; ii++) {
					if(tmpLinks[ii].href.length){
						links.push({
							cat : catName,
							href : tmpLinks[ii].href,
							text : tmpLinks[ii].innerText
						});
					}
				}
			}
		}else{
			tmpLinks = document.querySelectorAll('a');

			for (var i = 0; i < tmpLinks.length; i++) {
				if(tmpLinks[i].href.length){
					links.push({
						href : tmpLinks[i].href,
						text : tmpLinks[i].innerText
					});
				}
			}

		}

		return links;
	});

	openLinks(links, 0);

});