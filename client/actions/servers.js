import {INIT_SERVERS, ADD_SERVER, REMOVE_SERVER} from '../constants/ActionTypes';

export const initServers = (server) => {
	return {
		type: INIT_SERVERS,
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
