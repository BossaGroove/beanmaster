/**
 * Created by Bossa on 2/12/14.
 */


function getRow(new_tube_info) {

	var tr = $(document.createElement('tr'));

	for (var key in new_tube_info) {
		if (new_tube_info.hasOwnProperty(key)) {
			if (key === 'name') {
				tr.append(
					$(document.createElement('td'))
						.append(
							$(document.createElement('a'))
								.attr('href', '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + new_tube_info[key])
								.html(new_tube_info[key])
						)

				);
			} else {
				tr.append(
					$(document.createElement('td'))
						.html(new_tube_info[key])
				);
			}

		}
	}

	return tr;
}

function tabulateTubeInfo(tubes_info) {
	var rows = $('#tube_table > tbody').find('tr');

	var cells = null,
		i = 0;

	for (i = 0; i < rows.length; i++) {

		cells = $(rows[i]).find('td');
		var tube_name = cells.eq(0).text();

		if (tubes_info[tube_name]) {
			//check cells content
			var column = 0;
			for (var key in tubes_info[tube_name]) {
				if (tubes_info[tube_name].hasOwnProperty(key)) {
					//skip tube name checking
					if (column > 0) {
						var cell = cells.eq(column);

						if (parseInt(tubes_info[tube_name][key]) !== parseInt(cell.text())) {
							updateCellValue(cell, tubes_info[tube_name][key]);
						}
					}
					column++;
				}
			}
		} else {
			//row on table did not exists anymore in the info from server, delete the row from table
			$(rows[i]).remove();
		}

		//after process, remove from tubes_info
		delete tubes_info[tube_name];
	}

	//the left over inside tubes_info is new tubes
	for (var new_tube_name in tubes_info) {
		if (tubes_info.hasOwnProperty(new_tube_name)) {

			rows = $('#tube_table > tbody').find('tr');

			var new_row = null;
			var row_added = false;
			//search the position
			for (i = 0; i < rows.length; i++) {
				var row = $(rows[i]);
				cells = row.find('td');
				var table_tube_name = cells.eq(0).text();

				if (table_tube_name > new_tube_name) {
					new_row = getRow(tubes_info[new_tube_name]);
					row.before(new_row);
					row_added = true;
					break;
				}
			}

			//last row
			if (!row_added) {
				new_row = getRow(tubes_info[new_tube_name]);
				row.after(new_row);
			}
		}
	}
}

function refreshTubeInfo() {

	$('.alert').remove();

	$.ajax({
		url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/refresh',
		method: 'get',
		dataType: 'json',
		beforeSend: function() {
		},
		complete: function() {
		},
		success: function(data) {

			if (data.err) {

				$('#error_container').append(
					getErrorBox('warning', data.err)
				);

				$('button').attr('disabled', 'disabled');

			} else {
				tabulateTubeInfo(data.tubes_info);

				if (auto_update) {
					setTimeout(function(){
						refreshTubeInfo();
					}, 1000);
				}
			}
		},
		error: function(err) {
			console.log(err);
		}
	});

}

$(function() {
	if ($('#error').val() === '') {
		setTimeout(function(){
			refreshTubeInfo();
		}, 1000);
	} else {
		$('button').attr('disabled', 'disabled');
	}

	auto_update_handler = refreshTubeInfo;
});