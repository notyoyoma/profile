var colors = {
	dark 	: "#5b2920",
	med		: "#813a2d",
	light : "#a84a39",
	lgray : "#a3a3a3",
	dgray : "#8a8a8a"
};

$.fn.respond = function() {
	$(this).attr('width', $(this).parent().width() ); //max width
	$(this).attr('height', $(this).parent().height() ); //max height
}
