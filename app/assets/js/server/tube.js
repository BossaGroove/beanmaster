/* global $,Utility */

/**
 * Created by Bossa on 2/12/14.
 */

var busy = false;
var pending_task = null;

function tabulateTubeInfo(tube_info) {
	var cells = $('#tube_table > tbody > tr').find('td');

	if (tube_info) {
		//check cells content
		var column = 0;
		for (var key in tube_info) {
			if (tube_info.hasOwnProperty(key)) {
				//skip tube name checking
				var cell = cells.eq(column);
				if (column > 0) {
					Utility.updateCellValue(cell, tube_info[key], parseInt(cell.text()), parseInt(tube_info[key]));
				} else {
					cell.text(tube_info[key]);
				}
				column++;
			}
		}
	}
}

function tabulateStats(stats) {

	for (var key in stats) {
		if (stats.hasOwnProperty(key)) {

			var container = $('#' + key).find('.detail');

			if (stats[key]) {
				container.show().removeClass('hide');

				var tbody = container.find('table > tbody');

				var rows = tbody.find('tr');
				var stat_key = null;

				if (rows.length === 0) {
					for (stat_key in stats[key].stat) {
						if (stats[key].stat.hasOwnProperty(stat_key)) {
							tbody.append(
								$(document.createElement('tr'))
									.append(
										$(document.createElement('td'))
											.html(stat_key)
									)
									.append(
										$(document.createElement('td'))
											.html(stats[key].stat[stat_key])
									)
							);
						}
					}
				} else {
					for (var i = 0; i < rows.length; i++) {
						var cells = $(rows[i]).find('td');
						stat_key = cells.eq(0).text();
						var new_value = stats[key].stat[stat_key];
						var existing_value = cells.eq(1).text();

						if (!isNaN(parseInt(new_value))) {
							new_value = parseInt(new_value);
							existing_value = parseInt(existing_value);
						}

						Utility.updateCellValue(cells.eq(1), stats[key].stat[stat_key], existing_value, new_value);
					}
				}

				container.find('code').html(stats[key].payload_json || stats[key].payload);

			} else {
				container.hide();
			}
		}
	}
}

function updatePause(stats) {
	if (stats['pause-time-left'] > 0) {
		$('#btn_pause').html('<i class="glyphicon glyphicon-play"></i> Unpause');
	} else {
		$('#btn_pause').html('<i class="glyphicon glyphicon-pause"></i> Pause');
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

	busy = true;

	$.ajax({
		url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + $('#tube').val() + '/refresh',
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

				if (Object.keys(data.tube_info).length === 0) {
					hideTube();
				} else {
					showTube();
					tabulateTubeInfo(data.tube_info);
					tabulateStats(data.stats);
					updatePause(data.tube_info);
				}

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

function promptAddJob() {
	$('#add_job').modal({
		backdrop: 'static'
	}).find('input,textarea').val('');

	$('#tube_name').val($('#tube').val());
}

function blockForm() {
	$('#add_job,#tube-controls').find('input,button,textarea').attr('disabled', 'disabled');
	$('.preloader').show();
}

function unblockForm() {
	$('#add_job,#tube-controls').find('input,button,textarea').removeAttr('disabled');
	$('.preloader').hide();
}

function finishPendingTask() {
	if (Utility.isAutoUpdate()) {
		refreshTubeInfo();
	}
	pending_task = null;
}

var addJob = function() {
	if (busy) {
		blockForm();
		pending_task = {
			callee: addJob,
			arguments: []
		};
	} else {
		var fields = ['tube_name', 'payload', 'priority', 'delay', 'ttr'];

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
				url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + $('#tube').val() + '/add-job',
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
						//todo: show error
						console.log(data.err);
					} else {
						$('#add_job').modal('hide');
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

/**
 * send command
 * @param action {string} - action e.g. kick-job, delete-job, toogle-pause
 * @param value {number=} - optional value
 */
var sendCommand = function(action, value) {
	if (busy) {
		blockForm();
		pending_task = {
			callee: sendCommand,
			arguments: arguments
		};
	} else {

		if (typeof action !== 'string') {
			value = action[1] || null;
			action = action[0] || null;
		}

		var data = {
			_csrf: $('#_csrf').val(),
			value: value
		};

		$.ajax({
			url: '/' + encodeURIComponent($('#host').val()) + ':' + $('#port').val() + '/' + $('#tube').val() + '/' + action,
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
					//todo: show error
					console.log(data.err);
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
};

$(function() {
	if ($('#error').val() === '') {
		setTimeout(function() {
			refreshTubeInfo();
		}, 1000);
	} else {
		$('button').attr('disabled', 'disabled');
	}

	$('#btn_add_job').click(function() {
		promptAddJob();
	});

	$('#btn_add_job_confirm').click(function() {
		addJob();
	});

	$('#btn_pause').click(function() {
		sendCommand('toggle-pause');
	});

	$('#btn_kick,#ul_kick > li > a').click(function() {
		var value = $(this).attr('data-value') || 1;
		sendCommand('kick-job', value);
	});

	$('#btn_delete,#ul_delete > li > a').click(function() {
		var value = $(this).attr('data-value') || 1;
		sendCommand('delete-job', value);
	});

	Utility.setAutoUpdateHandler(refreshTubeInfo);
});