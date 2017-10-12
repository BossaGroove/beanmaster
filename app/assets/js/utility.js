/* global $ */

/**
 * Created by Bossa on 5/12/14.
 */

(function() {

	var auto_update = true,
		auto_update_handler = null;

	function Utility() {

	}

	Utility.getErrorBox = function(level, msg) {
		return $(document.createElement('div'))
			.addClass('alert')
			.addClass('alert-' + level)
			.html(msg);
	};

	Utility.highlightElement = function(element) {
		element.css('background-color', '');

		var color = element.css('background-color');

		element.css({
			'background-color': '#afa'
		}).animate({
				'background-color': color
			}, 500);
	};

	Utility.updateCellValue = function(cell, value) {
		cell.text(value);
		Utility.highlightElement(cell);
	};

	Utility.toggleAutoUpdate = function() {
		auto_update = !auto_update;

		$('#btn_toggle_auto_update')
			.removeClass('btn-default btn-danger')
			.addClass((auto_update ? 'btn-default' : 'btn-danger'));

		if (auto_update && typeof auto_update_handler === 'function') {
			auto_update_handler();
		}
	};

	Utility.isAutoUpdate = function() {
		return auto_update;
	};

	Utility.setAutoUpdateHandler = function(handler) {
		auto_update_handler = handler;
	};

	$(function() {
		$('#btn_toggle_auto_update').click(function() {
			Utility.toggleAutoUpdate();
		});
	});

	window.Utility = Utility;

})();
