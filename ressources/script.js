$(document).ready(function(){
	var obj = null;

	$.getJSON('generateliste.json', function(data) {
		obj = data;
		var el = $('#templateList');

		for (var i = 0, l = obj.length; i < l; i++) {
			var name = obj[i].text != "Anonym Link" ? obj[i].text : obj[i].href,
				li = $('<div class="link"><a href="'+ obj[i].link +'"><span class="thumbMask"><img src="'+ obj[i].render +'" class="thumb"/></span><span class="name">'+ name +'</span></a></div>');

			if(obj[i].categoryName && obj[i].categoryName.length){
				var id = obj[i].categoryName.replace(' ', '_');
				if(!$('#' + id).length){
					el.append($('<div id="'+ id +'" class="category"><div class="categoryName"><span>'+ obj[i].categoryName +'</span></div></div>'));
				}

				$('#' + id).append(li);
			}else{
				el.append(li);
			}

		}
	});
});