import {IS_BUSY, NOT_BUSY} from '../constants/ActionTypes';

export const isBusy = () => {
	return {
		type: IS_BUSY
	};
};

export const notBusy = () => {
	return {
		type: NOT_BUSY
	};
};
