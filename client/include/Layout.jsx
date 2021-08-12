import React from 'react';
import {Route, matchPath, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import {Container} from 'react-bootstrap';
import Server from '../pages/server/Server';
import Tube from '../pages/tube/Tube';
import TubeDetail from '../pages/tubeDetail/TubeDetail';

const Layout = (props) => {
	const showSearch = Boolean(matchPath(props.location.pathname, {
		path: '/:server',
		exact: true
	}));

	const showPause = Boolean(matchPath(props.location.pathname, {
		path: '/:server',
		exact: false
	}));

	return (
		<div>
			<Header showSearch={showSearch} showPause={showPause} />
			<Container fluid>
				<Switch>
					<Route exact path="/" component={Server} />
					<Route exact path="/:server" component={Tube} />
					<Route exact path="/:server/:tube" component={TubeDetail} />
				</Switch>
			</Container>
		</div>
	);
};

Layout.propTypes = {
	location: PropTypes.object.isRequired
};

export default Layout;
