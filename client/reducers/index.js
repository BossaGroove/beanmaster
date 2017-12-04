import {combineReducers} from 'redux';
import busy from './busy';
import servers from './servers';
import removeServerModal from './remove_server_modal';

export default combineReducers({
	servers,
	removeServerModal,
	busy
});
