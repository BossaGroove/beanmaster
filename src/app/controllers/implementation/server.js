'use strict';

const root = require('app-root-path');
const requireAll = require('require-all');
const _ = require('lodash');
const async = require('async');

const lib = require(`${root}/lib`);
const BeanstalkConfigManager = lib.BeanstalkConfigManager;
const BeanstalkConnectionManager = lib.BeanstalkConnectionManager;
const Utility = lib.Utility;

const AbstractController = require('../includes/abstract_controller');

function getTubesInfo(connection, callback) {
	async.waterfall([
		//get the tubes
		function(flow_callback) {
			connection.list_tubes(function(err, tubes) {
				flow_callback(err, tubes);
			});
		},

		function(tubes, flow_callback) {

			async.mapSeries(tubes, function(tube, tube_callback) {

				connection.stats_tube(tube, function(err, tube_data) {
					tube_callback(err, tube_data);
				});

			}, function(err, results) {
				flow_callback(err, results);
			});
		}

	], function(err, results) {
		let result_map = {};

		if (!err && _.isArray(results)) {
			if (results) {
				results = _.sortBy(results, 'name');
			}

			for (let i = 0; i < results.length; i++) {
				result_map[results[i].name] = results[i];
			}
		}

		callback(err, result_map);
	});
}

class ServerController extends AbstractController {
	constructor(request_handlers) {
		super();
		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${root}/app/controllers/includes/common`,
			resolve: function (Adaptor) {
				return new Adaptor();
			}
		}));
	}
	/**
	 * list all the beanstalk tubes
	 * @param req
	 * @param res
	 */
	* index(req, res) {
		let data = this._host_port_tube_adaptor.getData(req);

		try {
			this._host_port_tube_validator.validate(data);
		} catch(e) {
			// error = e.message;
			res.redirect('/');
			return;
		}

		let name = null;

		try {
			let configs = yield BeanstalkConfigManager.getConfig();
			name = _.get(_.find(configs, {host: data.host, port: data.port}), 'name', null);

			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);

			getTubesInfo(connection, function(err, tubes_info) {
				res.render('server/list', {
					page: 'servers',
					title: 'Beanmaster - ' + host_port[0] + ':' + host_port[1],
					name: name,
					host: data.host,
					port: data.port,
					err: err,
					tubes_info: tubes_info
				});
			});

		} catch (e) {
			res.render('server/list', {
				page: 'servers',
				title: 'Beanmaster - ' + data.host + ':' + data.port,
				name: name,
				host: data.host,
				port: data.port,
				err: e.message
			});
		}
	}

	/**
	 * get server tubes info in json format
	 * @param req
	 * @param res
	 */
	refreshTubes(req, res) {
		let host_port = Utility.validateHostPort(req.params.host_port);

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



	/**
	 * search job detail by job id
	 * @param req
	 * @param res
	 */
	searchJob(req, res) {
		let host_port = Utility.validateHostPort(req.params.host_port);
		let job_id = parseInt(req.body.job_id);

		if (isNaN(job_id)) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				err: 'job_id error'
			});
		} else {
			BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
				if (err) {
					res.json({
						host: host_port[0],
						port: host_port[1],
						err: err
					});
				} else {
					connection.stats_job(job_id, function(err, stat) {
						res.json({
							host: host_port[0],
							port: host_port[1],
							err: err,
							stat: stat
						});

					});
				}
			});
		}
	}


	kickJobId(req, res) {
		let host_port = Utility.validateHostPort(req.params.host_port);
		let job_id = parseInt(req.body.job_id);

		if (isNaN(job_id)) {
			res.json({
				host: host_port[0],
				port: host_port[1],
				err: 'job_id error'
			});
		} else {
			BeanstalkConnectionManager.getConnection(host_port[0], host_port[1], function(err, connection) {
				if (err) {
					res.json({
						host: host_port[0],
						port: host_port[1],
						err: err
					});
				} else {
					connection.kick_job(job_id, function(err) {
						res.json({
							host: host_port[0],
							port: host_port[1],
							err: err
						});

					});
				}
			});
		}
	}
}


module.exports = new ServerController();
