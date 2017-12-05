import {SHOW_REMOVE_SERVER_MODAL, HIDE_REMOVE_SERVER_MODAL} from '../constants/ActionTypes';

export default function removeServerModal(state, action) {
	switch (action.type) {
		case SHOW_REMOVE_SERVER_MODAL:
			return {
				show: true,
				server: action.payload
			};
		case HIDE_REMOVE_SERVER_MODAL:
			return {
				show: false,
				server: {}
			};
		default:
			return state || {
				show: false,
				server: {}
			};
	}
};