# Template list generator
Generate a json file from link list in a webpage and a directory with screenshots.

## How to use
At first you need a local or an online page with a specifique html markup.

Launch bash script in a terminal :

	./generate-template.sh http://yoururl.com [screenshotSize]

## About the reference list markup
On your page you just need a `div` with this id `templateListReference`

	<div id="templateListReference">
    	<a href="http://www.google.fr">Google</a>
    	<a href="http://www.smashingmagazine.com/">Smashing Magazine</a>
    	<a href="http://www.elegantthemes.com/">Elegant themes</a>
    </div>

### Category
You can make a category with an inside `div.category` and attribute `data-category-name`. For example :

	<div id="templateListReference">
    	<div class="category" data-category-name="My Category">
    		<a href="http://www.google.fr">Google</a>
    		<a href="http://www.smashingmagazine.com/">Smashing Magazine</a>
    		<a href="http://www.elegantthemes.com/">Elegant themes</a>
    	</div>
    </div>

### Viewport size width
You can set the viewport size for a specific link or a category. Default is `1024`.

	<div id="templateListReference">
		<a href="http://www.google.fr">Google</a>
        <a href="http://www.smashingmagazine.com/" data-viewport-width="320">Smashing Magazine</a>
        <a href="http://www.elegantthemes.com/">Elegant themes</a>

    	<div class="category" data-category-name="My Category" data-viewport-width="320">
    		<a href="http://www.google.fr">Google</a>
    		<a href="http://www.smashingmagazine.com/">Smashing Magazine</a>
    		<a href="http://www.elegantthemes.com/">Elegant themes</a>
    	</div>
    </div>

So you can take screenshot in different window size

	<div id="templateListReference">
        <a href="http://www.smashingmagazine.com/">Smashing Magazine</a>
        <a href="http://www.smashingmagazine.com/" data-viewport-width="320">Smashing Magazine</a>
    </div>

## About the output JSON
The generate json file name is `generateliste.json`. Here is the format :

	[
		{
    		"link":"http://www.smashingmagazine.com/",
    		"text":"Smashing Magazine",
    		"categoryName":"Categorie 2",
    		"viewportWidth":"680",
    		"render":"screenshots/link5.png"
    	},
    	{
    		"link":"http://www.elegantthemes.com/",
    		"text":"Elegant themes",
    		"categoryName":"Categorie 2",
    		"viewportWidth":"680",
    		"render":"screenshots/link6.png"
    	}
    ]

## Required
- Phantom JS (Tested with 1.6.0)
- Pyton (Tested with 3.3.0) with PIL 1.7
	- Download for windows : http://www.lfd.uci.edu/~gohlke/pythonlibs/