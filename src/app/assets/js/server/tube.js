/**
 * Created by Bossa on 2/12/14.
 */

//todo: put in utility
function highlightElement(element) {
	element.css('background-color', '');

	var color = element.css('background-color');

	element.css({
		'background-color' : '#afa'
	}).animate({
			'background-color' : color
		}, 500);
}

//todo: put in utility
function updateCellValue(cell, value) {
	cell.text(value);
	highlightElement(cell);
}

function tabulateTubeInfo(tube_info) {
	var cells = $('#tube_table > tbody > tr').find('td');
	var tube_name = cells.eq(0).text();

	if (tube_info) {
		//check cells content
		var column = 0;
		for (var key in tube_info) {
			if (tube_info.hasOwnProperty(key)) {
				//skip tube name checking
				var cell = cells.eq(column);
				if (column > 0) {
					if (parseInt(tube_info[key]) !== parseInt(cell.text())) {
						updateCellValue(cell, tube_info[key]);
					}
				} else {
					cell.text(tube_info[key]);
				}
				column++;
			}
		}
	} else {
		//row on table did not exists anymore in the info from server
	}
}

function hideTube() {
	$('#not_found').show().removeClass('hide');
	$('#tube_table').hide();
}

function showTube() {
	$('#not_found').hide();
	$('#tube_table').show().removeClass('hide');
}

function refreshTubeInfo() {

	$.ajax({
		url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + $('#tube').val() + '/refresh',
		method: 'get',
		dataType: 'json',
		beforeSend: function() {
		},
		complete: function() {
		},
		success: function(data) {

			if (data.err === 'NOT_FOUND') {
				hideTube();
			} else {
				showTube();
				tabulateTubeInfo(data.tube_info);
			}

			setTimeout(function(){
				refreshTubeInfo();
			}, 1000);
		},
		error: function(err) {
			console.log(err);
		}
	});

}

$(function() {

	$('#test_btn').click(function(){
		refreshTubeInfo();
	});

	setTimeout(function(){
		//refreshTubeInfo();
	}, 1000);

});