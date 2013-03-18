console.log('Starting > template-list-generator.js')
var page = require('webpage').create(),
	system = require('system'),
	fs = require('fs'),
	completeObject = [],
	config = {
		url : system.args[1],
		fileName : "generateliste.json"
	};

if (system.args.length < 2) {
	console.log('You should specify a start url');
	phantom.exit(1);
}

function openLinks(links, i){

	if(i == links.length){
		finalize();
	}

	var link = links[i];

	if(link.href === undefined ){
		console.log('Skip > ' + link.href);
		i++;
		openLinks(links, i);
		return true;
	}

	if(!/http/.test(link.href)){
		link.href = config.url + link.href;
	}

	page.viewportSize = {
		width: link.viewportWidth ? link.viewportWidth : 1024,
		height: 768
	};

	console.log('Opening > ' + link.href + ' (viewport: ' + page.viewportSize.width + ' / infinite )');
	page.open(link.href, function(link, links, completeObject, i){
		return function(status){

			console.log(status);
			if (status == 'success'){
				console.log('Rendering...');
				page.render('screenshots/link' + i +'.png');
				link.render = 'screenshots/link'+i+'.png';

				completeObject.push(link);
			}

			page.release();
			page = require('webpage').create();
			i++;
			openLinks(links, i);

		}

	}(link, links, completeObject, i));
}


/**
 * Finalize Script
 */
function finalize(){
	//Log registerObject
	console.log('Writing > '+ config.fileName);
	if(fs.isFile(config.fileName)){
		fs.remove(config.fileName);
	}
	fs.write(config.fileName, JSON.stringify(completeObject), 'a');
	phantom.exit();
};


// Open init page
page.open(config.url, function(status){
	if(status != 'success'){
		console.log('Impossible to open page')
		phantom.exit();
	}

	page.onConsoleMessage = function (msg){
		console.log(msg);
	};

	var linkArray = page.evaluate(function(){
		var templateListReference = document.getElementById('templateListReference'),
			links = templateListReference.querySelectorAll('a'),
			linkArrayOutput = [];

		var getLinkObject = function(link){
			if(link.href && link.href.length && link.href != "#"){
				var viewportWidth,
					category,
					categoryName,
					linkObject = {};

				linkObject.href = link.href;
				linkObject.text = link.innerText;

				//Set category node
				if(/category\b/.test(link.parentNode.className)){
					category = link.parentNode;
				}

				//Set category name
				if(category !== undefined && category.getAttribute('data-category-name') && category.getAttribute('data-category-name').length){
					categoryName = category.getAttribute('data-category-name');
					linkObject.categoryName = categoryName;
				}

				//Set viewport width
				if(link.getAttribute('data-viewport-width') && link.getAttribute('data-viewport-width').length){
					viewportWidth = link.getAttribute('data-viewport-width');
					linkObject.viewportWidth = viewportWidth;
				}else if(categoryName && category.getAttribute('data-viewport-width') && category.getAttribute('data-viewport-width').length){
					viewportWidth = category.getAttribute('data-viewport-width');
					linkObject.viewportWidth = viewportWidth;
				}

				return linkObject;
			}else{
				return;
			}
		};

		for (var i = 0; i < links.length; i++) {
			linkArrayOutput.push(getLinkObject(links[i]))
		}

		return linkArrayOutput;
	});

	openLinks(linkArray, 0);

});