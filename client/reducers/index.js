import {combineReducers} from 'redux';
import servers from './servers';
import addServerModal from './addServerModal';
import removeServerModal from './removeServerModal';
import searchJobModal from './searchJobModal';
import currentServer from './currentServer';
import busy from './busy';
import {reducer as form} from 'redux-form';

export default combineReducers({
	servers,
	addServerModal,
	removeServerModal,
	searchJobModal,
	currentServer,
	busy,
	form
});
