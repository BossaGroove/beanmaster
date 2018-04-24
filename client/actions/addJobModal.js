import {SHOW_ADD_JOB_MODAL, HIDE_ADD_JOB_MODAL} from '../constants/ActionTypes';

export const showAddJobModal = () => {
	return {
		type: SHOW_ADD_JOB_MODAL
	};
};

export const hideAddJobModal = () => {
	return {
		type: HIDE_ADD_JOB_MODAL
	};
};
