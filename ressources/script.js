$(document).ready(function(){
	var obj = null;

	$.getJSON('finalObject.json', function(data) {
		obj = data;
		var el = $('#templateList');

		for (var i = 0, l = obj.length; i < l; i++) {
			var name = obj[i].text != "Anonym Link" ? obj[i].text : obj[i].href,
				li = $('<div class="link"><a href="'+ obj[i].link +'"><span class="thumbMask"><img src="'+ obj[i].render +'" class="thumb"/></span><span class="name">'+ name +':'+ obj[i].cat +'</span></a></div>');
			el.append(li);

		}
	});
});