/**
 * Created by Bossa on 2014/11/30.
 */

var BeanstalkConfigManager = require('../../lib/beanstalk_config_manager'),
	BeanstalkConnectionManager = require('../../lib/beanstalk_connection_manager'),
	async = require('async'),
	_ = require('lodash');

/**
 * get server info
 * @param configs {Array} - configs
 * @param callback {function(Object, Array=)} - finish callback
 */
function getServerInfo(configs, callback) {
	async.mapLimit(configs, 5, function(config, flow_callback) {
		BeanstalkConnectionManager.getConnection(config.host, config.port, function(err, connection) {

			var config_with_detail = _.cloneDeep(config);
			config_with_detail.server_info = {};

			if (!err) {
				connection.stats(function(err, results) {
					config_with_detail.server_info = results;
					flow_callback(null, config_with_detail);
				});
			} else {
				flow_callback(null, config_with_detail);
			}
		});
	}, function(err, config_with_detail) {
		callback(err, config_with_detail);
	});
}

/**
 *
 * GET /
 * server lists controller
 * @param req
 * @param res
 */
exports.servers = function(req, res) {

	BeanstalkConfigManager.getConfig(function(err, configs) {
		getServerInfo(configs, function(err, config_with_detail) {
			if (err || !config_with_detail) {
				config_with_detail = [];
			}
			res.render('home/servers', {
				page: 'Servers',
				title: 'Beanmaster',
				config: config_with_detail
			});

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
		getServerInfo(new_config, function(err, config_with_detail) {
			res.json({
				err: err,
				config: config_with_detail
			});
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
		getServerInfo(new_config, function(err, config_with_detail) {
			res.json({
				err: err,
				config: config_with_detail
			});
		});
	});

};