import {SHOW_SEARCH_JOB_MODAL, HIDE_SEARCH_JOB_MODAL} from '../constants/ActionTypes';

export default function searchJobModal(state, action) {
	switch (action.type) {
		case SHOW_SEARCH_JOB_MODAL:
			return {
				show: true
			};
		case HIDE_SEARCH_JOB_MODAL:
			return {
				show: false
			};
		default:
			return state || {
				show: false
			};
	}
}
