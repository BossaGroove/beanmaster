'use strict';

const requireAll = require('require-all');
const _ = require('lodash');

const lib = require('../../../lib');
const {BeanstalkConfigManager, BeanstalkConnectionManager} = lib;

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
	async index(req, res) {
		const data = this._host_port_tube_adapter.getData(req);

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
			tube_info = await this.getTubeInfo(data.host, data.port, data.tube);
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
	async refreshTube(req, res) {
		const data = this._host_port_tube_adapter.getData(req);
		let err = null;

		try {
			this._host_port_tube_validator.validate(data);
		} catch (e) {
			err = e.message;
		}

		let tube_info = null;

		if (!err) {
			try {
				tube_info = await this.getTubeInfo(data.host, data.port, data.tube);
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


	async getTubeInfo(host, port, tube) {
		const configs = await BeanstalkConfigManager.getConfig();
		const name = _.get(_.find(configs, {host: host, port: port}), 'name', null);
		const connection = await BeanstalkConnectionManager.connect(host, port);

		const [tube_info] = await connection.stats_tubeAsync(tube);
		let stats = {
			'peek_ready': null,
			'peek_delayed': null,
			'peek_buried': null
		};

		if (tube_info) {
			const next_job = await this.getNextJobs(connection, tube);
			if (!_.isEmpty(next_job)) {
				stats = next_job;
			}
		}

		await BeanstalkConnectionManager.closeConnection(connection);
		return {
			name: name,
			tube_info: tube_info || {},
			stats: stats
		};
	}


	async getNextJobs(connection, tube) {
		const actions = ['peek_ready', 'peek_delayed', 'peek_buried'];
		const output = {};

		await connection.useAsync(tube);

		for (let i = 0; i < actions.length; i++) {
			let job_id = null;
			let payload = null;

			try {
				[job_id, payload] = await connection[`${actions[i]}Async`]();
				job_id = parseInt(job_id, 10);
				payload = payload.toString();
			} catch (e) {
				if (e.message !== 'NOT_FOUND') {
					throw e;
				}
			}

			if (!_.isFinite(job_id)) {
				output[actions[i]] = null;
				continue;
			}

			const [job_stat] = await connection.stats_jobAsync(job_id);

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
	async addJob(req, res) {
		const data = this._add_job_adapter.getData(req);
		let err = null;
		let job_id = null;

		try {
			this._add_job_validator.validate(data);
			const connection = await BeanstalkConnectionManager.connect(data.host, data.port);
			await connection.useAsync(data.tube_name);
			[job_id] = await connection.putAsync(data.priority, data.delay, data.ttr, data.payload);

			await BeanstalkConnectionManager.closeConnection(connection);
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
	async kickJob(req, res) {
		const data = this._repeat_operation_adapter.getData(req);
		let err = null;
		let num_kicked = null;

		try {
			this._repeat_operation_validator.validate(data);
			const connection = await BeanstalkConnectionManager.connect(data.host, data.port);
			await connection.useAsync(data.tube);
			[num_kicked] = await connection.kickAsync(data.value);

			await BeanstalkConnectionManager.closeConnection(connection);
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
	async deleteJob(req, res) {
		const data = this._repeat_operation_adapter.getData(req);
		let err = null;

		try {
			this._repeat_operation_validator.validate(data);
			const connection = await BeanstalkConnectionManager.connect(data.host, data.port);
			await connection.useAsync(data.tube);

			for (let i = 0; i < data.value; i++) {
				const [job_id] = await connection.peek_readyAsync();
				await connection.destroyAsync(job_id);
			}

			await BeanstalkConnectionManager.closeConnection(connection);
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
	async togglePause(req, res) {
		const data = this._host_port_tube_adapter.getData(req);
		let err = null;

		try {
			this._host_port_tube_validator.validate(data);
			const connection = await BeanstalkConnectionManager.connect(data.host, data.port);
			const [tube_info] = await connection.stats_tubeAsync(data.tube);

			let delay = 3600;

			if (tube_info['pause-time-left'] > 0) {
				delay = 0;
			}

			await connection.pause_tubeAsync(data.tube, delay);

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			err = e.message;
		}

		res.json({
			err: err
		});
	}
}

module.exports = new TubeController();
