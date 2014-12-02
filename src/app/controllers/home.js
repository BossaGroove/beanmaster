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
exports.servers = function(req, res) {

	BeanstalkConfigManager.getConfig(function(err, config){
		res.render('home/servers', {
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
		res.json({
			err: err,
			config: new_config
		});
	});

};
/**
 * POST /deleteServer
 * delete server
 * @param req
 * @param res
 */
exports.deleteServer = function(req, res) {

	var config_to_be_deleted = {
		host: req.body.host.trim(),
		port: req.body.port.replace(/[^0-9]/, '')
	};

	BeanstalkConfigManager.deleteConfig(config_to_be_deleted, function(err, new_config) {
		res.json({
			err: err,
			config: new_config
		});
	});

};