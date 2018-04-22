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

		const host = ctx.request.query.host;
		const port = parseInt(ctx.request.query.port, 10);
		const tube = ctx.request.query.tube;

		try {
			stat = await TubeController.getTubeInfo({
				host,
				port,
				tube
			});
		} catch (e) {
			console.log(e);
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

		const [tubeInfo] = await connection.stats_tubeAsync(tube);
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


}

module.exports = TubeController;
