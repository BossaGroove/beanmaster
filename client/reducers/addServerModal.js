import {SHOW_ADD_SERVER_MODAL, HIDE_ADD_SERVER_MODAL} from '../constants/ActionTypes';

export default function addServerModal(state, action) {
	switch (action.type) {
		case SHOW_ADD_SERVER_MODAL:
			return {
				show: true
			};
		case HIDE_ADD_SERVER_MODAL:
			return {
				show: false
			};
		default:
			return state || {
				show: false
			};
	}
};