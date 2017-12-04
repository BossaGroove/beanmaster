import {SHOW_REMOVE_SERVER_MODAL, HIDE_REMOVE_SERVER_MODAL} from '../constants/ActionTypes';

export const showRemoveServerModal = (server) => {
	return {
		type: SHOW_REMOVE_SERVER_MODAL,
		payload: server
	}
};

export const hideRemoveServerModal = () => {
	return {
		type: HIDE_REMOVE_SERVER_MODAL
	}
};