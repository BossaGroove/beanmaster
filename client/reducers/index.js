import {combineReducers} from 'redux';
import busy from './busy';
import servers from './servers';
import addServerModal from './addServerModal';
import removeServerModal from './removeServerModal';

export default combineReducers({
	servers,
	addServerModal,
	removeServerModal,
	busy
});
