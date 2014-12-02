/**
 * Created by Bossa on 14/11/30.
 */
var validator = require('validator'),
	_ = require('lodash'),
	async = require('async');

var BeanstalkConfigManager = require('../../lib/beanstalk_config_manager'),
	BeanstalkConnectionManager = require('../../lib/beanstalk_connection_manager');

//todo: put in util
function validateHostPort(host_port) {
	if (!host_port) {
		return false;
	} else {
		host_port = host_port.split(':');
		if (host_port.length !== 2) {
			return false;
		} else {
			if ((!validator.isURL(host_port[0]) && !validator.isIP(host_port[0])) || !validator.isNumeric(host_port[1])) {
				return false;
			}
		}
	}

	return host_port;
}

function getTubesInfo(connection, callback) {

	async.waterfall([

		//get the tubes
		function(flow_callback) {
			connection.list_tubes(function(err, tubes) {
				flow_callback(err, tubes)
			});
		},

		function(tubes, flow_callback) {

			async.mapSeries(tubes, function(tube, tube_callback) {

				connection.stats_tube(tube, function(err, tube_data) {
					tube_callback(err, tube_data);
				});

			}, function(err, results) {
				flow_callback(err, results)
			});
		}

	], function(err, results) {

		if (results) {
			results = _.sortBy(results, 'name');
		}

		var result_map = {};

		for (var i = 0; i < results.length; i++) {
			result_map[results[i].name] = results[i];
		}

		callback(err, result_map);
	});
}

/**
 * list all the beanstalk tubes
 * @param req
 * @param res
 */
exports.listServerTubes = function(req, res) {

	var host_port = req.params.host_port || null;

	host_port = validateHostPort(host_port);

	if (host_port) {
		//get the connection name
		BeanstalkConfigManager.getConfig(function(err, config) {

			if (err) {
				res.redirect('/');
			} else {
				//connect to beanstalk
				var saved_config = _.find(config, {host: host_port[0], port: host_port[1]});
				var name = saved_config ? saved_config.name : null;

				BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
					if (err) {
						res.redirect('/');
					} else {
						getTubesInfo(connection, function(err, tubes_info) {
							res.render('server/list', {
								page: 'Servers',
								title: 'Servers',
								name: name,
								host: host_port[0],
								port: host_port[1],
								err: err,
								tubes_info: tubes_info
							});
						});
					}
				});
			}
		});
	}
};

/**
 * get server tubes info in json format
 * @param req
 * @param res
 */
exports.refreshServerTubes = function(req, res) {
	var host_port = req.params.host_port || null;

	host_port = validateHostPort(host_port);

	if (host_port) {
		//get the connection name
		BeanstalkConfigManager.getConfig(function(err, config) {

			if (err) {
				res.json({
					host: host_port[0],
					port: host_port[1],
					err: err
				});
			} else {
				//connect to beanstalk
				var saved_config = _.find(config, {host: host_port[0], port: host_port[1]});
				var name = saved_config ? saved_config.name : null;

				BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {

					if (err) {
						res.json({
							host: host_port[0],
							port: host_port[1],
							err: err
						});
					} else {
						getTubesInfo(connection, function(err, tubes_info) {
							res.json({
								host: host_port[0],
								port: host_port[1],
								err: err,
								tubes_info: tubes_info
							});
						});
					}
				});
			}

		});
	} else {
		res.json({
			err: 'host_port error'
		});
	}
};

/**
 * show tube detail
 * @param req
 * @param res
 */
exports.tube = function(req, res) {
	var host_port = req.params.host_port || null;
	var tube = req.params.tube || null;

	host_port = validateHostPort(host_port);

	if (host_port) {

		//get the connection name
		BeanstalkConfigManager.getConfig(function(err, config) {

			if (err) {
				res.redirect('/');
			} else {
				//connect to beanstalk
				var saved_config = _.find(config, {host: host_port[0], port: host_port[1]});
				var name = saved_config ? saved_config.name : null;

				BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
					if (err) {
						res.redirect('/');
					} else {

						connection.stats_tube(tube, function(err, tube_info) {

							if (err) {
								res.redirect('/');
							} else {

								res.render('server/tube', {
									page: 'tube',
									title: 'Tube ' + tube,
									name: name,
									host: host_port[0],
									port: host_port[1],
									tube: tube,
									err: err,
									tube_info: tube_info
								});
							}

						});
					}
				});
			}
		});

	} else {
		res.redirect('/');
	}
};