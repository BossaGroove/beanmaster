const requireAll = require('require-all');

const lib = require('../../../lib');
const {BeanstalkConfigManager, BeanstalkConnectionManager} = lib;

class HomeController {
	/**
	 * GET /
	 * server lists controller
	 * @param ctx
	 * @param next
	 */
	static async index(ctx, next) {
		ctx.body = 'home';

		await next();
	}
}

module.exports = HomeController;
