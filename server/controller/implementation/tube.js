const _ = require('lodash');
const lib = require('../../lib');
const {BeanstalkConfigManager, BeanstalkConnectionManager, ResponseManager} = lib;

class TubeController {
	/**
	 * GET /tubes/stat
	 * @param ctx
	 */
	static async getStat(ctx) {
		let stat;

		const {host, tube} = ctx.request.query;
		const port = parseInt(ctx.request.query.port, 10);

		try {
			stat = await TubeController.getTubeInfo({
				host,
				port,
				tube
			});
		} catch (e) {
			stat = null;
		}

		ctx.body = ResponseManager.response({
			stat
		});
	}

	static async getTubeInfo({host, port, tube}) {
		const configs = await BeanstalkConfigManager.getConfig();
		const name = _.get(_.find(configs, {host: host, port: port}), 'name', null);
		const connection = await BeanstalkConnectionManager.connect(host, port);

		let tubeInfo = null;

		try {
			[tubeInfo] = await connection.stats_tubeAsync(tube);
		} catch (e) {
		}

		let stats = {
			'peek_ready': null,
			'peek_delayed': null,
			'peek_buried': null
		};

		if (tubeInfo) {
			const nextJob = await TubeController.getNextJobs(connection, tube);
			if (!_.isEmpty(nextJob)) {
				stats = nextJob;
			}
		}

		await BeanstalkConnectionManager.closeConnection(connection);
		return {
			name,
			tubeInfo: tubeInfo || {},
			stats
		};
	}

	static async getNextJobs(connection, tube) {
		const actions = ['peek_ready', 'peek_delayed', 'peek_buried'];
		const output = {};

		await connection.useAsync(tube);

		for (let i = 0; i < actions.length; i++) {
			let jobId = null;
			let payload = null;

			try {
				[jobId, payload] = await connection[`${actions[i]}Async`]();
				jobId = parseInt(jobId, 10);
				payload = payload.toString();
			} catch (e) {
				if (e.message !== 'NOT_FOUND') {
					throw e;
				}
			}

			if (!_.isFinite(jobId)) {
				output[actions[i]] = null;
				continue;
			}

			const [jobStat] = await connection.stats_jobAsync(jobId);

			// try to beautify the payload
			let payloadJson = null;

			try {
				payloadJson = JSON.stringify(JSON.parse(payload), null, 2);
			} catch (e) {
				payloadJson = null;
			}

			output[actions[i]] = {
				stat: jobStat,
				payload: payload,
				payloadJson: payloadJson
			};
		}

		return output;
	}

	/**
	 * POST /tubes/add-job
	 * @param ctx
	 */
	static async addJob(ctx) {
		const {host, tube, payload} = ctx.request.body;
		const port = parseInt(ctx.request.body.port, 10);
		const priority = ctx.request.body.priority || 0;
		const delay = ctx.request.body.delay || 0;
		const ttr = ctx.request.body.ttr || 1;

		let jobId;

		try {
			const connection = await BeanstalkConnectionManager.connect(host, port);
			await connection.useAsync(tube);
			[jobId] = await connection.putAsync(priority, delay, ttr, payload);
			jobId = parseInt(jobId, 10);
			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			const errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
			return;
		}
		ctx.body = ResponseManager.response({
			jobId
		});
	}
	/**
	 * POST /tubes/kick-job
	 * @param ctx
	 */
	static async kickJob(ctx) {
		const {host, tube, value} = ctx.request.body;
		const port = parseInt(ctx.request.body.port, 10);
		let kicked = 0;

		try {
			const connection = await BeanstalkConnectionManager.connect(host, port);
			await connection.useAsync(tube);
			[kicked] = await connection.kickAsync(value);

			kicked = parseInt(kicked, 10);

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			const errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
			return;
		}

		ctx.body = ResponseManager.response({
			kicked
		});
	}
	/**
	 * POST /tubes/delete-job
	 * @param ctx
	 */
	static async deleteJob(ctx) {
		const {host, tube, value} = ctx.request.body;
		const port = parseInt(ctx.request.body.port, 10);

		try {
			const connection = await BeanstalkConnectionManager.connect(host, port);
			await connection.useAsync(tube);

			for (let i = 0; i < value; i++) {
				const [jobId] = await connection.peek_readyAsync();
				await connection.destroyAsync(jobId);
			}
			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			const errorMessage = e.message;
			if (errorMessage !== 'NOT_FOUND') {
				ctx.status = 400;
				ctx.body = ResponseManager.error(null, 400, errorMessage);
				return;
			}
		}

		ctx.body = ResponseManager.response({
		});
	}

	/**
	 * POST /tubes/toggle-pause
	 * @param ctx
	 */
	static async togglePause(ctx) {
		const {host, tube} = ctx.request.body;
		const port = parseInt(ctx.request.body.port, 10);

		try {
			const connection = await BeanstalkConnectionManager.connect(host, port);
			const [tubeInfo] = await connection.stats_tubeAsync(tube);

			let delay = 3600;

			if (tubeInfo['pause-time-left'] > 0) {
				delay = 0;
			}

			await connection.pause_tubeAsync(tube, delay);

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			const errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
			return;
		}

		ctx.body = ResponseManager.response({

		});
	}
}

module.exports = TubeController;
