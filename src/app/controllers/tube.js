/**
 * Created by Bossa on 10/12/14.
 */

var _ = require('lodash'),
	async = require('async'),
	Utility = require('../../lib/utility');

var BeanstalkConfigManager = require('../../lib/beanstalk_config_manager'),
	BeanstalkConnectionManager = require('../../lib/beanstalk_connection_manager');

function getNextJobs(connection, tube, callback) {

	var actions = ['peek_ready', 'peek_delayed', 'peek_buried'];

	connection.use(tube, function(err) {
		if (err) {
			callback(err, null);
		} else {
			async.mapSeries(actions, function(action, flow_callback) {

				connection[action](function(err, job_id, payload) {

					if (err) {
						flow_callback(null, null);
					} else {
						connection.stats_job(job_id, function(err, stat) {

							if (err) {
								flow_callback(null, null);
							} else {

								var payload_parsed = payload.toString();

								var payload_parsed_json = null;

								try {
									payload_parsed_json = JSON.parse(payload_parsed);
									payload_parsed_json = JSON.stringify(payload_parsed_json, null, 2);
								} catch (e) {
									payload_parsed_json = null;
								}

								flow_callback(null, {
									payload: payload_parsed,
									payload_json: payload_parsed_json,
									stat: stat
								});
							}
						});
					}
				});

			}, function(err, results) {
				var map_result = {};
				for (var i = 0; i < actions.length; i++) {
					map_result[actions[i]] = results[i];
				}

				callback(err, map_result);
			});
		}
	});
}

function getTube(host, port, tube, callback) {

	BeanstalkConfigManager.getConfig(function(err, config) {
		if (err) {
			callback(err, null);
		} else {
			//connect to beanstalk
			var saved_config = _.find(config, {host: host, port: port});
			var name = saved_config ? saved_config.name : null;

			BeanstalkConnectionManager.getConnection(host, port, function(err, connection) {
				if (err) {
					callback(err, null);
				} else {

					connection.stats_tube(tube, function(err, tube_info) {
						async.waterfall([
							function(flow_callback) {
								if (tube_info) {
									getNextJobs(connection, tube, function(err, stats) {
										flow_callback(err, stats);
									});
								} else {
									flow_callback(err, null);
								}
							}
						], function(err, stats) {
							tube_info = tube_info || {};
							stats = stats || {
								'peek_ready': null,
								'peek_delayed': null,
								'peek_buried': null
							};

							callback(err, {
								name: name,
								tube_info: tube_info,
								stats: stats
							});
						});
					});
				}
			});
		}
	});
}

/**
 * show tube detail
 * @param req
 * @param res
 */
exports.tube = function(req, res) {
	var host_port = req.params.host_port || null;
	var tube = req.params.tube || null;

	host_port = Utility.validateHostPort(host_port);

	if (host_port && tube) {
		getTube(host_port[0], host_port[1], tube, function(err, results) {
			res.render('server/tube', {
				page: 'tube',
				title: 'Beanmaster - ' + host_port[0] + ':' + host_port[1] + ' / ' + tube,
				name: results.name,
				host: host_port[0],
				port: host_port[1],
				tube: tube,
				err: err,
				tube_info: results.tube_info,
				stats: results.stats
			});

		});
	} else {
		res.redirect('/');
	}
};


/**
 * get server tubes info in json format
 * @param req
 * @param res
 */
exports.refreshTube = function(req, res) {
	var host_port = Utility.validateHostPort(req.params.host_port);
	var tube = req.params.tube || null;

	if (host_port && tube) {
		getTube(host_port[0], host_port[1], tube, function(err, results) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				tube: tube,
				err: err,
				tube_info: results.tube_info,
				stats: results.stats
			});
		});
	} else {
		res.json({
			err: 'host, port or tube error'
		});
	}
};

/**
 * add job
 * @param req
 * @param res
 */
exports.addJob = function(req, res) {
	var host_port = Utility.validateHostPort(req.params.host_port);
	var tube = req.params.tube || null;

	BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
		if (err) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				err: err
			});
		} else {
			connection.use(req.body.tube_name, function(err, tube_name) {
				if (err) {
					res.json({
						err: 'use tube ' + req.body.tube_name + ' error'
					});
				} else {
					connection.put(req.body.priority || 0, req.body.delay || 0, req.body.ttr || 0, req.body.payload, function(err, job_id) {
						res.json({
							err: err,
							job_id: job_id
						});
					});
				}
			});
		}
	});
};

/**
 * kick next delayed and buried job
 * @param req
 * @param res
 */
exports.kickJob = function(req, res) {
	var host_port = Utility.validateHostPort(req.params.host_port);
	var tube = req.params.tube || null;
	var value = parseInt(req.body.value);

	if (isNaN(value)) {
		value = 1;
	}

	BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
		if (err) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				err: err
			});
		} else {
			connection.use(tube, function(err, tube_name) {
				if (err) {
					res.json({
						err: 'use tube ' + tube + ' error'
					});
				} else {
					connection.kick(value, function(err, num_kicked) {
						res.json({
							err: err,
							num_kicked: num_kicked
						});
					});
				}
			});
		}
	});
};

/**
 * delete next ready job
 * @param req
 * @param res
 */
exports.deleteJob = function(req, res) {
	var host_port = Utility.validateHostPort(req.params.host_port);
	var tube = req.params.tube || null;
	var value = parseInt(req.body.value);

	if (isNaN(value)) {
		value = 1;
	}

	BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
		if (err) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				err: err
			});
		} else {
			connection.use(tube, function(err, tube_name) {
				if (err) {
					res.json({
						err: 'use tube ' + tube + ' error'
					});
				} else {
					async.timesSeries(value, function(n, callback) {
						connection.peek_ready(function(err, job_id, payload) {
							if (err) {
								callback(err);
							} else {
								connection.destroy(job_id, function(err) {
									callback(err);
								});
							}
						});
					}, function(err) {
						res.json({
							err: err
						});
					});
				}
			});
		}
	});
};

exports.togglePause = function(req, res) {
	var host_port = Utility.validateHostPort(req.params.host_port);
	var tube = req.params.tube || null;

	BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
		if (err) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				err: err
			});
		} else {
			connection.stats_tube(tube, function(err, tube_info) {
				if (err) {
					res.json({
						host: host_port[0],
						port: host_port[1],
						err: err
					});
				} else {

					var delay = 3600;

					if (tube_info['pause-time-left'] > 0) {
						delay = 0;
					}

					connection.pause_tube(tube, delay, function(err) {
						res.json({
							err: err
						});
					});
				}
			});

		}
	});
};