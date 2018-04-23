import {combineReducers} from 'redux';
import servers from './servers';
import addServerModal from './addServerModal';
import addJobModal from './addJobModal';
import removeServerModal from './removeServerModal';
import searchJobModal from './searchJobModal';
import currentServer from './currentServer';
import autoUpdate from './autoUpdate';
import serverRow from './serverRow';
import tubes from './tubes';
import tubeDetail from './tubeDetail';
import busy from './busy';
import {reducer as form} from 'redux-form';

export default combineReducers({
	servers,
	addServerModal,
	removeServerModal,
	searchJobModal,
	addJobModal,
	currentServer,
	autoUpdate,
	serverRow,
	tubes,
	tubeDetail,
	busy,
	form
});
