const _ = require('lodash');
const lib = require('../../lib');
const {BeanstalkConfigManager, BeanstalkConnectionManager, ResponseManager} = lib;

class ServerController {
	/**
	 * GET /servers
	 * @param ctx
	 */
	static async index(ctx) {
		const configs = await BeanstalkConfigManager.getConfig();

		ctx.body = ResponseManager.response({
			servers: configs
		});
	}

	/**
	 * GET /servers/info
	 * @param ctx
	 */
	static async getInfo(ctx) {
		let name;

		const host = ctx.request.query.host;
		const port = parseInt(ctx.request.query.port);

		try {
			const configs = await BeanstalkConfigManager.getConfig();
			name = _.get(_.find(configs, {host, port}), 'name', null);
		} catch (e) {
			name = null;
		}

		ctx.body = ResponseManager.response({
			info: {
				name,
				host,
				port
			}
		});
	}

	/**
	 * GET /servers/stat
	 * @param ctx
	 */
	static async getStat(ctx) {
		let stat;

		try {
			const connection = await BeanstalkConnectionManager.connect(ctx.request.query.host, ctx.request.query.port);
			[stat] = await connection.statsAsync();
			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			stat = null;
		}

		ctx.body = ResponseManager.response({
			stat: stat
		});
	}

	/**
	 * GET /servers/tubes
	 * @param ctx
	 */
	static async getTubes(ctx) {
		let name;
		let tubesInfo;

		const host = ctx.request.query.host;
		const port = parseInt(ctx.request.query.port);

		try {
			const configs = await BeanstalkConfigManager.getConfig();
			name = _.get(_.find(configs, {host, port}), 'name', null);

			const connection = await BeanstalkConnectionManager.connect(host, port);
			tubesInfo = await ServerController.getTubesInfo(connection);
			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			name = null;
			tubesInfo = null;
		}

		ctx.body = ResponseManager.response({
			name,
			tubesInfo
		});
	}


	/**
	 * GET /servers/tubes/stat
	 * @param ctx
	 */
	static async getTubeStat(ctx) {
		let stat;

		try {
			const connection = await BeanstalkConnectionManager.connect(ctx.request.query.host, ctx.request.query.port);
			[stat] = await connection.statsAsync();
			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			stat = null;
		}

		ctx.body = ResponseManager.response({
			stat: stat
		});
	}

	/**
	 * POST /servers
	 * @param ctx
	 */
	static async addServer(ctx) {
		let server;

		try {
			server = {
				name: ctx.request.body.name,
				host: ctx.request.body.host,
				port: parseInt(ctx.request.body.port)
			};

			await BeanstalkConfigManager.addConfig(server);
		} catch (e) {
			let errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
			return;
		}

		ctx.body = ResponseManager.response({
			server: server
		});
	}

	/**
	 * DELETE /servers
	 * @param ctx
	 */
	static async deleteServer(ctx) {
		let server;

		try {
			server = {
				host: ctx.request.query.host,
				port: parseInt(ctx.request.query.port)
			};

			await BeanstalkConfigManager.deleteConfig(server);
		} catch (e) {
			let errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
			return;
		}

		ctx.body = ResponseManager.response({
			server: server
		});
	}

	/**
	 * POST /servers/search
	 * @param ctx
	 */
	static async search(ctx) {
		let stat;

		const host = ctx.request.body.host;
		const port = parseInt(ctx.request.body.port);
		const job_id = parseInt(ctx.request.body.job_id);

		try {
			const connection = await BeanstalkConnectionManager.connect(host, port);
			[stat] = await connection.stats_jobAsync(job_id);

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			stat = null;
		}

		ctx.body = ResponseManager.response({
			stat
		});
	}

	/**
	 * POST /servers/kick
	 * @param ctx
	 */
	static async kick(ctx) {
		const host = ctx.request.body.host;
		const port = parseInt(ctx.request.body.port);
		const job_id = parseInt(ctx.request.body.job_id);

		try {
			const connection = await BeanstalkConnectionManager.connect(host, port);
			await connection.kick_jobAsync(job_id);

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			let errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
			return;
		}

		ctx.body = ResponseManager.response({
		});
	}


	/**
	 * get tubes info for a connection
	 * @param {Object} connection - fivebean connection object
	 * @returns {Object} - tube info, with tube name as key
	 */
	static async getTubesInfo(connection) {
		const [tubes] = await connection.list_tubesAsync();
		tubes.sort();

		const tubesInfo = [];

		for (let i = 0; i < tubes.length; i++) {
			tubesInfo.push(_.get(await connection.stats_tubeAsync(tubes[i]), '0', {}));
		}

		return tubesInfo;
	}
}

module.exports = ServerController;
