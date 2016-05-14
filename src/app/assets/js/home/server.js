/* global $,validator */

function promptDeleteServer(button) {
	var cells = $(button).parent().parent().find('td');
	var host = cells.eq(1).text();
	var port = cells.eq(2).text();

	$('#delete_server').modal({
		backdrop: 'static'
	});

	$('#delete_server_host').val(host);
	$('#delete_server_port').val(port);

	$('span#delete_server_name').html(host + ':' + port);
}

function initDeleteButton() {
	$('button.delete').on('click', function(){
		promptDeleteServer(this);
	});
}

function blockForm() {
	$('#add_server,#delete_server').find('input,button').attr('disabled', 'disabled');
	$('.preloader').show();
}

function unblockForm() {
	$('#add_server,#delete_server').find('input,button').removeAttr('disabled');
	$('.preloader').hide();
}

function tabulateServer(result) {
	var tbody = $('#server_list > tbody');

	//remove existing
	tbody.find('tr').remove();

	for (var i = 0; i < result.length; i++) {
		tbody.append(
			$(document.createElement('tr'))
				.append(
					$(document.createElement('td'))
						.html(result[i].name)
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].host)
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].port)
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].server_info['current-connections'] || '-')
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].server_info.version || '-')
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].server_info['total-jobs'] || '-')
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].server_info.pid || '-')
				)
				.append(
					$(document.createElement('td'))
						.html(result[i].server_info.uptime || '-')
				)
				.append(
					$(document.createElement('td'))
						.append(
						$(document.createElement('a'))
							.addClass('btn')
							.addClass('btn-primary')
							.attr('href', '/' + encodeURIComponent(result[i].host) + ':' + result[i].port)
							.html('View')
					)
				)
				.append(
					$(document.createElement('td'))
						.append(
						$(document.createElement('button'))
							.addClass('btn')
							.addClass('btn-danger')
							.addClass('delete')
							.html('Delete')
					)
				)
		);
	}

	initDeleteButton();
}

function saveServer() {

	var name = $('#name');
	var host = $('#host');
	var port = $('#port');

	host.parent().parent().removeClass('has-warning');
	port.parent().parent().removeClass('has-warning');

	var valid = true;

	if (!validator.isURL(host.val()) && !validator.isIP(host.val())) {
		host.parent().parent().addClass('has-warning');
		valid = false;
	}

	if (!validator.isNumeric(port.val())) {
		port.parent().parent().addClass('has-warning');
		valid = false;
	}

	if (port.val() < 0 || port.val() >= 65536) {
		port.parent().parent().addClass('has-warning');
		valid = false;
	}

	var data = {
		_csrf: $('#_csrf').val(),
		name: name.val(),
		host: host.val(),
		port: port.val()
	};


	if (valid) {
		$.ajax({
			url: '/add-server',
			method: 'POST',
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
					console.log(data.err);
				} else {
					tabulateServer(data.config);
					$('#add_server').modal('hide');
					$('#server_form').find('input').val('');
				}
			},
			error: function() {

			}
		});
	}
}

function deleteServer() {
	var host = $('#delete_server_host');
	var port = $('#delete_server_port');

	var data = {
		_csrf: $('#_csrf').val(),
		host: host.val(),
		port: port.val()
	};

	$.ajax({
		url: '/delete-server',
		method: 'POST',
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
				console.log(data.err);
			} else {
				tabulateServer(data.config);
				$('#delete_server').modal('hide');
				host.val('');
				port.val('');
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function promptAddServer() {
	$('#add_server').modal({
		backdrop: 'static'
	});
}

$(function() {
	$('#btn_add_server').click(function() {
		promptAddServer();
	});

	$('#btn_save_server').click(function() {
		saveServer();
	});

	$('#btn_delete_server').click(function() {
		deleteServer();
	});


	initDeleteButton();
});