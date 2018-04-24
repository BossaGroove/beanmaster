import React, {Component} from 'react';
import {Route, matchPath, Switch} from 'react-router-dom';
import Header from './Header';
import Server from '../pages/server/Server';
import Tube from '../pages/tube/Tube';
import TubeDetail from '../pages/tubeDetail/TubeDetail';

class Layout extends Component {
	render() {
		const showSearch = matchPath(this.props.location.pathname, {
			path: '/:server',
			exact: true
		});

		const showPause = matchPath(this.props.location.pathname, {
			path: '/:server',
			exact: false
		});

		return (
			<div>
				<Header showSearch={showSearch} showPause={showPause} />
				<main className="container-fluid">
					<Switch>
						<Route exact path="/" component={Server} />
						<Route exact path="/:server" component={Tube} />
						<Route exact path="/:server/:tube" component={TubeDetail} />
					</Switch>
				</main>
			</div>
		);
	}
}

export default Layout;
