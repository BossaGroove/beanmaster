import {START_AUTO_UPDATE, STOP_AUTO_UPDATE, TOGGLE_AUTO_UPDATE} from '../constants/ActionTypes';

export const startAutoUpdate = () => {
	return {
		type: START_AUTO_UPDATE
	}
};

export const stopAutoUpdate = () => {
	return {
		type: STOP_AUTO_UPDATE
	}
};

export const toggleAutoUpdate = () => {
	return {
		type: TOGGLE_AUTO_UPDATE
	}
};
