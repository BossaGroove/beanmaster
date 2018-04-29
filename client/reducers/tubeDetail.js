import {DISPATCH_TUBE_DETAIL, DESTROY_TUBE_DETAIL} from '../constants/ActionTypes';

export default function tubes(state = {}, action) {
	switch (action.type) {
		case DISPATCH_TUBE_DETAIL:
			return action.payload;
		case DESTROY_TUBE_DETAIL:
			return {};
		default:
			return state;
	}
}
