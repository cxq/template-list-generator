$(document).ready(function(){
	var obj = null;

	$.getJSON('finalObject.json', function(data) {
		obj = data;
		var ul = $('#templateList');

		for (var i = 0, l = obj.length; i < l; i++) {
			var name = obj[i].text != "Anonym Link" ? obj[i].text : obj[i].href,
				li = $('<li class="link"><a href="'+ obj[i].href +'"><span class="thumbMask"><img src="'+ obj[i].render +'" class="thumb"/></span><span class="name">'+ name +'</span></a></li>'),
				subUl = '<ul>';

			subUl+='</ul>';

			li.append($(subUl));
			ul.append(li);

		}
	});
});