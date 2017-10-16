'use strict';

const requireAll = require('require-all');

const lib = require('../../../lib');
const {BeanstalkConfigManager, BeanstalkConnectionManager} = lib;

const AbstractController = require('../includes/abstract_controller');

class HomeController extends AbstractController {
	constructor(request_handlers) {
		super();
		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${__dirname}/../includes/common`,
			resolve: function (Adapter) {
				return new Adapter();
			}
		}));

		this.wireEndpointDependencies(request_handlers, requireAll({
			dirname: `${__dirname}/../includes/home`,
			resolve: function (Adapter) {
				return new Adapter();
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
	async index(req, res) {
		const configs = await BeanstalkConfigManager.getConfig();

		res.render('home/servers', {
			page: 'Servers',
			title: 'Beanmaster',
			configs: configs
		});
	}

	/**
	 * GET /server/info
	 * @param req
	 * @param res
	 */
	async getInfo(req, res) {
		const data = this._host_port_adapter.getData(req);

		let stat;
		let error = null;

		try {
			this._host_port_validator.validate(data);
			const connection = await BeanstalkConnectionManager.connect(data.host, data.port);
			[stat] = await connection.statsAsync();

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			error = e.message;
			stat = null;
		}

		res.json({
			err: error,
			stat: stat
		});
	}

	/**
	 * POST /servers/add
	 * add server
	 * @param req
	 * @param res
	 */
	async addServer(req, res) {
		const data = this._add_server_adapter.getData(req);

		let connection_info;
		let error = null;

		try {
			this._add_server_validator.validate(data);

			await BeanstalkConfigManager.addConfig({
				name: data.name,
				host: data.host,
				port: data.port
			});

			const connection = await BeanstalkConnectionManager.connect(data.host, data.port);
			[connection_info] = await connection.statsAsync();

			await BeanstalkConnectionManager.closeConnection(connection);
		} catch (e) {
			error = e.message;
		}

		res.json({
			err: error,
			connection: {
				name: data.name,
				host: data.host,
				port: data.port
			},
			stat: connection_info
		});
	}

	/**
	 * POST /servers/delete
	 * delete server
	 * @param req
	 * @param res
	 */
	async deleteServer(req, res) {
		const data = this._delete_server_adapter.getData(req);
		let error = null;
		try {
			this._delete_server_validator.validate(data);

			await BeanstalkConfigManager.deleteConfig({
				host: data.host,
				port: data.port
			});
		} catch (e) {
			error = e.message;
		}

		res.json({
			err: error
		});
	}
}

module.exports = new HomeController();
