/**
 * Created by Bossa on 5/12/14.
 */

var auto_update = true,
	auto_update_handler = null;

function highlightElement(element) {
	element.css('background-color', '');

	var color = element.css('background-color');

	element.css({
		'background-color' : '#afa'
	}).animate({
		'background-color' : color
	}, 500);
}

function updateCellValue(cell, value) {
	cell.text(value);
	highlightElement(cell);
}

function toggleAutoUpdate() {
	auto_update = !auto_update;

	$('#btn_toggle_auto_update')
		.removeClass('btn-default btn-danger')
		.addClass((auto_update?'btn-default':'btn-danger'));

	if (auto_update && typeof auto_update_handler === 'function') {
		auto_update_handler();
	}
}

$(function(){
	$('#btn_toggle_auto_update').click(function(){
		toggleAutoUpdate();
	});
});