import {IS_BUSY, NOT_BUSY} from '../constants/ActionTypes';

export default function busy(state = false, action) {
	switch (action.type) {
		case IS_BUSY:
			return true;
		case NOT_BUSY:
			return false;
		default:
			return state;
	}
};