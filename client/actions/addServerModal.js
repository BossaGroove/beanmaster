import {SHOW_ADD_SERVER_MODAL, HIDE_ADD_SERVER_MODAL} from '../constants/ActionTypes';

export const showAddServerModal = () => {
	return {
		type: SHOW_ADD_SERVER_MODAL
	};
};

export const hideAddServerModal = () => {
	return {
		type: HIDE_ADD_SERVER_MODAL
	};
};
