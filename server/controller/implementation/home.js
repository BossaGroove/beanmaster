class HomeController {
	/**
	 * GET /
	 * server lists controller
	 * @param ctx
	 * @param next
	 */
	static async index(ctx, next) {
		await ctx.render('index', ctx.locals);
		await next();
	}
}

module.exports = HomeController;
