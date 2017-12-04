import {INIT_SERVER, ADD_SERVER, REMOVE_SERVER} from '../constants/ActionTypes';

export const initServer = (server) => {
	return {
		type: INIT_SERVER,
		payload: server
	}
};

export const addServer = (server) => {
	return {
		type: ADD_SERVER,
		payload: server
	}
};

export const removeServer = (server) => {
	return {
		type: REMOVE_SERVER,
		payload: server
	}
};
