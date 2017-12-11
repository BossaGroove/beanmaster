/**
 * Created by Bossa on 10/12/14.
 */

'use strict';

const path = require('path');
const validator = require('validator');
const querystring = require('querystring');
const _ = require('lodash');

class Utility {
	/**
	 * @param {string} host_port
	 * @returns {*}
	 */
	static validateHostPort(host_port) {
		if (!host_port) {
			return false;
		}

		const [host, port] = host_port.split(':');

		if ((!validator.isURL(host) && !validator.isIP(host)) || !validator.isNumeric(port)) {
			return false;
		}

		return host_port;
	}

	static getHomePath() {
		let beanmaster_home_path = '';

		if (process.env.BEANMASTER_HOME) {
			beanmaster_home_path = process.env.BEANMASTER_HOME;
		} else {
			beanmaster_home_path = path.resolve(process.env.HOME || process.env.HOMEPATH, '.beanmaster');
		}

		return beanmaster_home_path;
	}

	/**
	 * @param {Object} location
	 * @param {String} location.pathname - path name e.g. "/", "/abc", "/abc/", depends on browser exact path
	 * @param {String} location.search - query string including "?", e.g. "", "?abc=1", "?abc=1&def=2"
	 * @param {String} inputPath
	 * @param {Object} query
	 * @return {String}
	 */
	static pushHistory(location, inputPath, query) {
		// build the path
		let pathSeparator = '';

		if (location.pathname.substr(location.pathname.length - 1) !== '/') {
			pathSeparator = '/';
		}

		let outputPath = `${location.pathname}${pathSeparator}${inputPath}`;

		let cleanQuery = location.search;
		if (cleanQuery[0] === '?') {
			cleanQuery = cleanQuery.substr(1, cleanQuery.length - 1);
		}

		let queryObject = querystring.parse(cleanQuery);
		queryObject = _.merge(queryObject, query);

		let outputQuery = querystring.stringify(queryObject);
		if (outputQuery !== '') {
			outputQuery = `?${outputQuery}`;
		}

		return `${outputPath}${outputQuery}`;
	}
}

module.exports = Utility;
