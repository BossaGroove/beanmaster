import {DISPATCH_TUBE_DETAIL, DESTROY_TUBE_DETAIL} from '../constants/ActionTypes';

export const dispatchTubeDetail = (payload) => {
	return {
		type: DISPATCH_TUBE_DETAIL,
		payload
	}
};

export const destroyTubeDetail = () => {
	return {
		type: DESTROY_TUBE_DETAIL
	}
};
