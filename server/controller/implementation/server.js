const lib = require('../../lib');
const {BeanstalkConfigManager, BeanstalkConnectionManager, ResponseManager} = lib;

class HomeController {
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

	static async getTubes(ctx) {

	}

	/**
	 * POST /servers
	 * @param ctx
	 */
	static async addServer(ctx) {
		let server;
		let errorMessage = '';
		try {
			server = {
				name: ctx.request.body.name,
				host: ctx.request.body.host,
				port: parseInt(ctx.request.body.port)
			};

			await BeanstalkConfigManager.addConfig(server);
		} catch (e) {
			errorMessage = e.message;
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
		let errorMessage = '';
		try {
			server = {
				host: ctx.request.query.host,
				port: parseInt(ctx.request.query.port)
			};

			await BeanstalkConfigManager.deleteConfig(server);
		} catch (e) {
			errorMessage = e.message;
			ctx.status = 400;
			ctx.body = ResponseManager.error(null, 400, errorMessage);
		}

		ctx.body = ResponseManager.response({
			server: server
		});
	}
}

module.exports = HomeController;
