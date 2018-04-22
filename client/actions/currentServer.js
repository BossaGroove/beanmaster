import {SET_SERVER, UNSET_SERVER} from '../constants/ActionTypes';

export const setServer = (server) => {
	return {
		type: SET_SERVER,
		payload: server
	}
};

export const unsetServer = () => {
	return {
		type: UNSET_SERVER
	}
};