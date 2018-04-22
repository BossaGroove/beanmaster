import _ from 'lodash';
import {START_AUTO_UPDATE, STOP_AUTO_UPDATE, TOGGLE_AUTO_UPDATE} from '../constants/ActionTypes';

export default function servers(state = true, action) {
	switch (action.type) {
		case START_AUTO_UPDATE:
			return true;
		case STOP_AUTO_UPDATE:
			return false;
		case TOGGLE_AUTO_UPDATE:
			return !state;
		default:
			return state;
	}
};