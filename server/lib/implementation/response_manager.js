function response(body) {
	return {
		meta: {
			code: 200,
			error: null
		},
		body: body
	};
}

function error(body, metaCode, metaErrorMessage) {
	return {
		meta: {
			code: metaCode,
			error: metaErrorMessage
		},
		body: body
	};
}

module.exports = {
	response,
	error
};
