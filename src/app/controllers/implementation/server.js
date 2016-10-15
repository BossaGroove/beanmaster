'use strict';

const root = require('app-root-path');
const requireAll = require('require-all');
const _ = require('lodash');

const lib = require(`${root}/lib`);
const BeanstalkConfigManager = lib.BeanstalkConfigManager;
const BeanstalkConnectionManager = lib.BeanstalkConnectionManager;

const AbstractController = require('../includes/abstract_controller');

class ServerController extends AbstractController {
	constructor(request_handlers) {
		super();
		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${root}/app/controllers/includes/common`,
			resolve: function (Adapter) {
				return new Adapter();
			}
		}));

		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${root}/app/controllers/includes/server`,
			resolve: function (Adapter) {
				return new Adapter();
			}
		}));
	}
	/**
	 * GET /:host_port/
	 * list all the beanstalk tubes
	 * @param req
	 * @param res
	 */
	* index(req, res) {
		let data = this._host_port_tube_adapter.getData(req);

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
	 * GET /:host_port/refresh
	 * get server tubes info in json format
	 * @param req
	 * @param res
	 */
	* refreshTubes(req, res) {
		let data = this._host_port_tube_adapter.getData(req);
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
	 * POST /:host_port/search-job
	 * search job detail by job id
	 * @param req
	 * @param res
	 */
	* searchJob(req, res) {
		let data = this._job_id_adapter.getData(req);
		let err = null;

		try {
			this._job_id_validator.validate(data);
		} catch (e) {
			err = e.message;
		}

		let stat = null;

		try {
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			stat = (yield connection.stats_jobAsync(data.job_id))[0];
		} catch (e) {
			err = e.message;
		}

		res.json({
			host: data.host,
			port: data.port,
			stat: stat,
			err: err
		});
	}


	/**
	 * POST /:host_port/kick-job-id
	 * kick a job by job id
	 * @param req
	 * @param res
	 */
	* kickJobId(req, res) {
		let data = this._job_id_adapter.getData(req);
		let err = null;

		try {
			this._job_id_validator.validate(data);
		} catch (e) {
			err = e.message;
		}

		try {
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			yield connection.kick_jobAsync(data.job_id);
		} catch (e) {
			err = e.message;
		}

		res.json({
			host: data.host,
			port: data.port,
			err: err
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
		tubes = tubes[0];
		tubes.sort();

		let tubes_info = {};

		for (let i = 0; i < tubes.length; i++) {
			tubes_info[tubes[i]] = (yield connection.stats_tubeAsync(tubes[i]))[0];
		}

		return tubes_info;
	}
}


module.exports = new ServerController();
