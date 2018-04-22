import {SHOW_ADD_JOB_MODAL, HIDE_ADD_JOB_MODAL} from '../constants/ActionTypes';

export default function addJobModal(state, action) {
	switch (action.type) {
		case SHOW_ADD_JOB_MODAL:
			return {
				show: true
			};
		case HIDE_ADD_JOB_MODAL:
			return {
				show: false
			};
		default:
			return state || {
				show: false
			};
	}
};