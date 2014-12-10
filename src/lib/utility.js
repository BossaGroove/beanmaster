/**
 * Created by Bossa on 10/12/14.
 */


(function() {
	'use strict';

	var validator = require('validator');

	function Utility() {

	}

	Utility.validateHostPort = function(host_port) {
		if (!host_port) {
			return false;
		} else {
			host_port = host_port.split(':');
			if (host_port.length !== 2) {
				return false;
			} else {
				if ((!validator.isURL(host_port[0]) && !validator.isIP(host_port[0])) || !validator.isNumeric(host_port[1])) {
					return false;
				}
			}
		}

		return host_port;
	};


	module.exports = Utility;

})();
