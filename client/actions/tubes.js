import {DISPATCH_TUBES, DESTROY_TUBES} from '../constants/ActionTypes';

export const dispatchTubes = (payload) => {
	return {
		type: DISPATCH_TUBES,
		payload
	};
};

export const destroyTubes = () => {
	return {
		type: DESTROY_TUBES
	};
};
