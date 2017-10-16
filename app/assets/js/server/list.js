/*global $,Utility*/

/**
 * Created by Bossa on 2/12/14.
 */

var busy = false;
var pending_task = null;

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
		i;

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

						Utility.updateCellValue(cell, tubes_info[tube_name][key], parseInt(cell.text()), parseInt(tubes_info[tube_name][key]));
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
			var last_row = null;

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

				last_row = row;
			}

			//last row
			if (!row_added) {
				new_row = getRow(tubes_info[new_tube_name]);
				if (last_row) {
					last_row.after(new_row);
				}
			}
		}
	}
}

function blockForm() {
	$('#search_job').find('input,button,textarea').attr('disabled', 'disabled');
	$('.preloader').show();
}

function unblockForm() {
	$('#search_job').find('input,button,textarea').removeAttr('disabled');
	$('.preloader').hide();
}


function refreshTubeInfo() {

	busy = true;

	$('#error_container > .alert').remove();

	$.ajax({
		url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/refresh',
		method: 'get',
		dataType: 'json',
		beforeSend: function() {
		},
		complete: function() {
		},
		success: function(data) {
			busy = false;

			if (data.err) {
				$('#error_container').append(
					Utility.getErrorBox('warning', data.err)
				);

				$('button').attr('disabled', 'disabled');
			} else {
				tabulateTubeInfo(data.tubes_info);

				if (pending_task) {
					pending_task.callee(pending_task.arguments);
				} else {
					if (Utility.isAutoUpdate()) {
						setTimeout(function() {
							refreshTubeInfo();
						}, 1000);
					}
				}
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function finishPendingTask() {
	if (Utility.isAutoUpdate()) {
		refreshTubeInfo();
	}
	pending_task = null;
}

function promptSearchJob() {
	$('#search_job').modal({
		backdrop: 'static'
	}).find('input,textarea').val('');
}

var searchJob = function() {

	$('#search_error_container').html('');
	$('#search_result').hide();
	$('#btn_kick_job').hide();

	if (busy) {
		blockForm();
		pending_task = {
			callee: searchJob,
			arguments: []
		};
	} else {
		var fields = ['job_id'];

		var valid = true;

		var data = {
			_csrf: $('#_csrf').val()
		};

		for (var i = 0; i < fields.length; i++) {
			var element = $('#' + fields[i]);
			element.parent().parent().removeClass('has-warning');
			if (element.hasClass('required') && element.val() === '') {
				valid = false;
				element.parent().parent().addClass('has-warning');
			}
			data[fields[i]] = element.val();
		}

		if (valid) {
			$.ajax({
				url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/search-job',
				method: 'post',
				data: data,
				dataType: 'json',
				beforeSend: function() {
					blockForm();
				},
				complete: function() {
					unblockForm();
				},
				success: function(data) {
					if (data.err) {
						$('#search_error_container').append(
							Utility.getErrorBox('warning', data.err)
						);
					} else {
						$('#btn_kick_job').removeClass('hide').show();

						var tbody = $('#search_result').removeClass('hide').show().find('tbody');

						tbody.html('');

						for (var key in data.stat) {
							if (data.stat.hasOwnProperty(key)) {
								tbody.append(
									$(document.createElement('tr'))
										.append(
											$(document.createElement('td'))
												.html(key)
										)
										.append(
											$(document.createElement('td'))
												.html(data.stat[key])
										)
								);
							}
						}
					}

					if (pending_task) {
						finishPendingTask();
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
	}
};

var kickJobId = function() {
	$('#search_error_container').html('');
	$('#btn_kick_job').hide();

	if (busy) {
		blockForm();
		pending_task = {
			callee: kickJobId,
			arguments: []
		};
	} else {
		var fields = ['job_id'];

		var valid = true;

		var data = {
			_csrf: $('#_csrf').val()
		};

		for (var i = 0; i < fields.length; i++) {
			var element = $('#' + fields[i]);
			element.parent().parent().removeClass('has-warning');
			if (element.hasClass('required') && element.val() === '') {
				valid = false;
				element.parent().parent().addClass('has-warning');
			}
			data[fields[i]] = element.val();
		}

		if (valid) {
			$.ajax({
				url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/kick-job-id',
				method: 'post',
				data: data,
				dataType: 'json',
				beforeSend: function() {
					blockForm();
				},
				complete: function() {
					unblockForm();
				},
				success: function(data) {

					if (data.err) {

						$('#search_error_container').append(
							Utility.getErrorBox('warning', data.err)
						);

					} else {

						$('#search_error_container').append(
							Utility.getErrorBox('success', 'Job kicked')
						);
					}

					if (pending_task) {
						finishPendingTask();
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		}
	}
};

$(function() {
	if ($('#error').val() === '') {
		setTimeout(function() {
			refreshTubeInfo();
		}, 1000);
	} else {
		$('button').attr('disabled', 'disabled');
	}

	$('#btn_search').click(function() {
		promptSearchJob();
	});

	$('#btn_search_job_confirm').click(function() {
		searchJob();
	});

	$('#btn_kick_job').click(function() {
		kickJobId();
	});

	Utility.setAutoUpdateHandler(refreshTubeInfo);
});