/**
 * Created by Bossa on 2014/11/30.
 */

var BeanstalkConfigManager = require('../../lib/beanstalk_config_manager');

/**
 *
 * GET /
 * server lists controller
 * @param req
 * @param res
 */
exports.home = function(req, res) {

	BeanstalkConfigManager.getConfig(function(err, config){
		res.render('pages/servers', {
			page: 'Servers',
			title: 'Servers',
			config: config
		});
	});
};

/**
 * POST /addServer
 * add server
 * @param req
 * @param res
 */
exports.addServer = function(req, res) {

	var new_config = {
		name: req.body.name.trim(),
		host: req.body.host.trim(),
		port: req.body.port.replace(/[^0-9]/, '')
	};

	BeanstalkConfigManager.addConfig(new_config, function(err, new_config) {
		console.log(new_config);

		res.json({
			err: err,
			config: new_config
		});
	});

};