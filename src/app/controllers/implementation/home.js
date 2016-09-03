'use strict';

const root = require('app-root-path');
const requireAll = require('require-all');
const changeCase = require('change-case');

const async = require('async');
const _ = require('lodash');

const lib = require(`${root}/lib`);
const BeanstalkConfigManager = lib.BeanstalkConfigManager;
const BeanstalkConnectionManager = lib.BeanstalkConnectionManager;

const AbstractController = require('../includes/abstract_controller');
const BeanstalkHelper = require('../includes/beanstalk_helper');

class HomeController extends AbstractController {
	constructor(beanstalk_helper, request_handlers) {
		super();
		this._beanstalk_helper = beanstalk_helper || BeanstalkHelper;
		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${root}/app/controllers/includes/common`,
			resolve: function (Adaptor) {
				return new Adaptor();
			}
		}));
	}

	/**
	 *
	 * GET /
	 * server lists controller
	 * @param req
	 * @param res
	 */
	* index(req, res) {
		let configs = yield BeanstalkConfigManager.getConfig();

		res.render('home/servers', {
			page: 'Servers',
			title: 'Beanmaster',
			configs: configs
		});
	}

	* getInfo(req, res) {
		let data = this._host_port_adaptor.getData(req);

		let connection_info;
		let error = null;

		try {
			this._host_port_validator.validate(data);
			let connection = yield BeanstalkConnectionManager.getConnection(data.host, data.port);
			connection_info = yield connection.statsAsync();
		} catch (e) {
			error = e.message;
			connection_info = null;
		}

		res.json({
			err: error,
			connection_info: connection_info
		});
	}

	/**
	 * POST /servers/add
	 * add server
	 * @param req
	 * @param res
	 */
	addServer(req, res) {
		let new_config = {
			name: req.body.name.trim(),
			host: req.body.host.trim(),
			port: req.body.port.replace(/[^0-9]/, '')
		};

		BeanstalkConfigManager.addConfig(new_config, function (err, new_config) {
			getServerInfo(new_config, function (err, config_with_detail) {
				res.json({
					err: err,
					config: config_with_detail
				});
			});
		});
	}

	/**
	 * POST /servers/delete
	 * delete server
	 * @param req
	 * @param res
	 */
	deleteServer(req, res) {
		var config_to_be_deleted = {
			host: req.body.host.trim(),
			port: req.body.port.replace(/[^0-9]/, '')
		};

		BeanstalkConfigManager.deleteConfig(config_to_be_deleted, function (err, new_config) {
			getServerInfo(new_config, function (err, config_with_detail) {
				res.json({
					err: err,
					config: config_with_detail
				});
			});
		});
	}
}

module.exports = new HomeController();
