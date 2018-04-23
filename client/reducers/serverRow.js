import {DISPATCH_SERVER_ROW, DESTROY_SERVER_ROW} from '../constants/ActionTypes';

export default function serverRow(state = {}, action) {
	switch (action.type) {
		case DISPATCH_SERVER_ROW:
			return {
				...state,
				[`${action.host}:${action.port}`]: action.payload
			};
		case DESTROY_SERVER_ROW:
			return {};
		default:
			return state;
	}
};