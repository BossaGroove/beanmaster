import {SET_SERVER, UNSET_SERVER} from '../constants/ActionTypes';

export default function currentServer(state = {}, action) {
	switch (action.type) {
		case SET_SERVER:
			return action.payload;
		case UNSET_SERVER:
			return {};
		default:
			return state;
	}
};