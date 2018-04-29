import {SHOW_SEARCH_JOB_MODAL, HIDE_SEARCH_JOB_MODAL} from '../constants/ActionTypes';

export const showSearchJobModal = () => {
	return {
		type: SHOW_SEARCH_JOB_MODAL
	};
};

export const hideSearchJobModal = () => {
	return {
		type: HIDE_SEARCH_JOB_MODAL
	};
};
