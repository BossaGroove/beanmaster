import {DISPATCH_SERVER_ROW, DESTROY_SERVER_ROW} from '../constants/ActionTypes';

export const dispatchServerRow = (host, port, payload) => {
	return {
		type: DISPATCH_SERVER_ROW,
		payload,
		host,
		port
	}
};

export const destroyServerRow = () => {
	return {
		type: DESTROY_SERVER_ROW
	}
};
