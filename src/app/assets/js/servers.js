/* global $ */

function blockForm() {
	$('#server_form').find('input,button').attr('disabled', 'disabled');
	$('.preloader').show();
}

function unblockForm() {
	$('#server_form').find('input,button').removeAttr('disabled');
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
						.append(
						$(document.createElement('button'))
							.addClass('btn')
							.addClass('btn-danger')
							.html('Delete')
					)
				)
		);
	}

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
});