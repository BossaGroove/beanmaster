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
				port: ctx.request.body.port
			};

			await BeanstalkConfigManager.addConfig(server);
		} catch (e) {
			console.log(e);
			server = null;
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
		await ctx.render('index', ctx.locals);
	}
}

module.exports = HomeController;
