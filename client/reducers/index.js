import {combineReducers} from 'redux';
import busy from './busy';
import servers from './servers';
import addServerModal from './addServerModal';
import removeServerModal from './removeServerModal';
import searchJobModal from './searchJobModal';
import {reducer as form} from 'redux-form';

export default combineReducers({
	servers,
	addServerModal,
	removeServerModal,
	searchJobModal,
	busy,
	form
});
