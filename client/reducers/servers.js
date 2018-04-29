import {filter} from 'lodash-es';
import {INIT_SERVERS, ADD_SERVER, REMOVE_SERVER} from '../constants/ActionTypes';

export default function servers(state = [], action) {
	switch (action.type) {
		case INIT_SERVERS:
			return action.payload;
		case ADD_SERVER:
			return state.concat(action.payload);
		case REMOVE_SERVER:
			return filter(state, (server) => {
				return (server.host !== action.payload.host || server.port !== action.payload.port);
			});
		default:
			return state;
	}
}
