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

	console.log('openLinksMethod')

	if(i == links.length){
		finalize();
	}

	var link = links[i];

	if(link.href === undefined ){
		console.log('skip : ' + link.href);
		i++;
		openLinks(links, i);
		return true;
	}

	if(!/http/.test(link.href)){
		link.href = config.url + link.href;
	}

	console.log('Opening : ' + link.href + 'viewportSize : ' + link.viewportSize);
	page.viewportSize = {
		width: link.viewportWidth ? link.viewportWidth : 1024,
		height: 768
	};
	page.open(link.href, function(link, links, completeObject, i){
		return function(status){

			console.log('Open ' + status + ' on ' + link.href);
			if (status == 'success'){
				page.render('screenshots/link' + i +'.png');
				var tmpObj = {
					"link" : link.href,
					"text" : link.text,
					"categoryName" : link.categoryName,
					"viewportWidth" : link.viewportWidth,
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
	console.log('Writing : '+ config.fileName);
	if(fs.isFile(config.fileName)){
		fs.remove(config.fileName);
	}
	fs.write(config.fileName, JSON.stringify(completeObject), 'a');
	phantom.exit();
};

/**
 * Need to be execute in evalute function
 * @param link
 */
function getLinkObject(link){
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
					console.log(linkObject.categoryName)
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

		/*if (cat.length > 0){
			for (var i = 0; i < cat.length; i++) {
				catName = cat[i].getAttribute('data-category-name');
				tmpLinks = cat[i].querySelectorAll('a');

				for (var ii = 0; ii < tmpLinks.length; ii++) {
					if(tmpLinks[ii].href.length){
						var viewportWidth;
						if(tmpLinks[ii].getAttribute('data-viewport-width') && tmpLinks[ii].getAttribute('data-viewport-width').length){
							viewportWidth = tmpLinks[ii].getAttribute('data-viewport-width');
						}else if(catName && cat[i].getAttribute('data-viewport-width') && cat[i].getAttribute('data-viewport-width').length){
							viewportWidth = cat[i].getAttribute('data-viewport-width');
						}
						links.push({
							cat : catName,
							href : tmpLinks[ii].href,
							text : tmpLinks[ii].innerText,
							viewportWidth : viewportWidth
						});
					}
				}
			}
		}else{
			tmpLinks = templateListReference.querySelectorAll('a');

			for (var i = 0; i < tmpLinks.length; i++) {
				if(tmpLinks[i].href.length){
					links.push({
						href : tmpLinks[i].href,
						text : tmpLinks[i].innerText
					});
				}
			}

		}*/

		return linkArrayOutput;
	});

	openLinks(linkArray, 0);

});