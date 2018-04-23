import {DISPATCH_TUBES, DESTROY_TUBES} from '../constants/ActionTypes';

export default function tubes(state = [], action) {
	switch (action.type) {
		case DISPATCH_TUBES:
			return action.payload;
		case DESTROY_TUBES:
			return [];
		default:
			return state;
	}
};