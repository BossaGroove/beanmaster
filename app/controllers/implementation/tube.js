'use strict';

const requireAll = require('require-all');
const _ = require('lodash');

const lib = require('../../../lib');
const BeanstalkConfigManager = lib.BeanstalkConfigManager;
const BeanstalkConnectionManager = lib.BeanstalkConnectionManager;

const AbstractController = require('../includes/abstract_controller');


class TubeController extends AbstractController {
	constructor(request_handlers) {
		super();
		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${__dirname}/../includes/common`,
			resolve: function (Adapter) {
				return new Adapter();
			}
		}));

		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${__dirname}/../includes/tube`,
			resolve: function (Adapter) {
				return new Adapter();
			}
		}));
	}

	/**
	 * GET /:host_port/:tube
	 * show tube detail
	 * @param req
	 * @param res
	 */
	* index(req, res) {
		let data = this._host_port_tube_adapter.getData(req);

		try {
			this._host_port_tube_validator.validate(data);
		} catch (e) {
			res.redirect('/');
			return;
		}

		let err = null;
		let tube_info = {
			name: null,
			tube_info: {},
			stats: {}
		};

		try {
			tube_info = yield this.getTubeInfo(data.host, data.port, data.tube);
		} catch (e) {
			err = e.message;
		}

		res.render('server/tube', {
			page: 'tube',
			title: 'Beanmaster - ' + data.host + ':' + data.port + ' / ' + data.tube,
			name: tube_info.name,
			host: data.host,
			port: data.port,
			tube: data.tube,
			err: err,
			tube_info: tube_info.tube_info,
			stats: tube_info.stats
		});
	}


	/**
	 * GET /:host_port/:tube/refresh
	 * get server tubes info in json format
	 * @param req
	 * @param res
	 */
	* refreshTube(req, res) {
		let data = this._host_port_tube_adapter.getData(req);
		let err = null;

		try {
			this._host_port_tube_validator.validate(data);
		} catch (e) {
			err = e.message;
		}

		let tube_info = null;

		if (!err) {
			try {
				tube_info = yield this.getTubeInfo(data.host, data.port, data.tube);
			} catch (e) {
				err = e.message;
			}
		}

		res.json({
			host: data.host,
			port: data.port,
			tube: data.tube,
			err: err,
			tube_info: tube_info.tube_info,
			stats: tube_info.stats
		});
	}


	* getTubeInfo(host, port, tube) {
		let configs = yield BeanstalkConfigManager.getConfig();
		let name = _.get(_.find(configs, {host: host, port: port}), 'name', null);
		let connection = yield BeanstalkConnectionManager.getConnection(host, port);

		let tube_info = (yield connection.stats_tubeAsync(tube))[0];
		let stats = {
			'peek_ready': null,
			'peek_delayed': null,
			'peek_buried': null
		};

		if (tube_info) {
			let next_job = yield this.getNextJobs(connection, tube);
			if (!_.isEmpty(next_job)) {
				stats = next_job;
			}
		}

		return {
			name: name,
			tube_info: tube_info || {},
			stats: stats
		};
	}


	* getNextJobs(connection, tube) {
		let actions = ['peek_ready', 'peek_delayed', 'peek_buried'];
		let output = {};

		yield connection.useAsync(tube);

		for (let i = 0; i < actions.length; i++) {
			let job = null;
			let job_id = null;
			let payload = null;

			try {
				job = yield connection[`${actions[i]}Async`]();
				job_id = parseInt(job[0], 10);
				payload = job[1].toString();
			} catch (e) {
				if (e.message !== 'NOT_FOUND') {
					throw e;
				}
			}

			if (!_.isFinite(job_id)) {
				output[actions[i]] = null;
				continue;
			}

			let job_stat = (yield connection.stats_jobAsync(job_id))[0];

			// try to beautify the payload
			let payload_json = null;

			try {
				payload_json = JSON.stringify(JSON.parse(payload), null, 2);
			} catch (e) {
				payload_json = null;
			}

			output[actions[i]] = {
				stat: job_stat,
				payload: payload,
				payload_json: payload_json
			};
		}

		return output;
	}


	/**
	 * POST /:host_port/:tube/add-job
	 * add job
	 * @param req
	 * @param res
	 */
	* addJob(req, res) {
		let data = this._add_job_adapter.getData(req);
		let err = null;
		let job_id = null;

		try {
			this._add_job_validator.validate(data);
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			yield connection.useAsync(data.tube_name);
			job_id = (yield connection.putAsync(data.priority, data.delay, data.ttr, data.payload))[0];
		} catch (e) {
			err = e.message;
		}

		res.json({
			err: err,
			job_id: job_id
		});
	}

	/**
	 * POST /:host_port/:tube/kick-job
	 * kick next delayed and buried job
	 * @param req
	 * @param res
	 */
	* kickJob(req, res) {
		let data = this._repeat_operation_adapter.getData(req);
		let err = null;
		let num_kicked = null;

		try {
			this._repeat_operation_validator.validate(data);
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			yield connection.useAsync(data.tube);
			num_kicked = (yield connection.kickAsync(data.value))[0];
		} catch (e) {
			err = e.message;
		}

		res.json({
			err: err,
			num_kicked: num_kicked
		});
	}

	/**
	 * POST /:host_port/:tube/delete-job
	 * delete next ready job
	 * @param req
	 * @param res
	 */
	* deleteJob(req, res) {
		let data = this._repeat_operation_adapter.getData(req);
		let err = null;

		try {
			this._repeat_operation_validator.validate(data);
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			yield connection.useAsync(data.tube);

			for (let i = 0; i < data.value; i++) {
				let job_id = (yield connection.peek_readyAsync())[0];
				yield connection.destroyAsync(job_id);
			}
		} catch (e) {
			err = e.message;
		}

		res.json({
			err: err
		});
	}

	/**
	 * POST /:host_port/:tube/toggle-pause
	 * Pausing tube by setting pause value to 1 hour
	 * @param req
	 * @param res
	 */
	* togglePause(req, res) {
		let data = this._host_port_tube_adapter.getData(req);
		let err = null;

		try {
			this._host_port_tube_validator.validate(data);
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			let tube_info = (yield connection.stats_tubeAsync(data.tube))[0];

			let delay = 3600;

			if (tube_info['pause-time-left'] > 0) {
				delay = 0;
			}

			yield connection.pause_tubeAsync(data.tube, delay);
		} catch (e) {
			err = e.message;
		}

		res.json({
			err: err
		});
	}
}

module.exports = new TubeController();
