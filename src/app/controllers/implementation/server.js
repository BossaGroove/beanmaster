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
			this._host_port_validator.validate(data);
		} catch (e) {
			res.redirect('/');
			return;
		}

		let name = null;
		let err = null;
		let tubes_info = null;

		try {
			let configs = yield BeanstalkConfigManager.getConfig();
			name = _.get(_.find(configs, {host: data.host, port: data.port}), 'name', null);

			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			tubes_info = yield this.getTubesInfo(connection);
		} catch (e) {
			err = e.message;
		}

		res.render('server/list', {
			page: 'servers',
			title: 'Beanmaster - ' + data.host + ':' + data.port,
			name: name,
			host: data.host,
			port: data.port,
			err: err,
			tubes_info: tubes_info
		});
	}

	/**
	 * get server tubes info in json format
	 * @param req
	 * @param res
	 */
	* refreshTubes(req, res) {
		let data = this._host_port_tube_adaptor.getData(req);
		let err = null;

		try {
			this._host_port_validator.validate(data);
		} catch (e) {
			err = e.message;
		}

		let tubes_info = null;

		try {
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			tubes_info = yield this.getTubesInfo(connection);
		} catch (e) {
			err = e.message;
		}

		res.json({
			err: err,
			tubes_info: tubes_info
		});
	}


	/**
	 * get tubes info for a connection
	 * @param {Object} connection - fivebean connection object
	 * @returns {Object} - tube info, with tube name as key
	 */
	* getTubesInfo(connection) {
		// get tubes
		let tubes = yield connection.list_tubesAsync();
		tubes.sort();

		let tubes_info = {};

		for (let i = 0; i < tubes.length; i++) {
			tubes_info[tubes[i]] = yield connection.stats_tubeAsync(tubes[i]);
		}

		return tubes_info;
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
