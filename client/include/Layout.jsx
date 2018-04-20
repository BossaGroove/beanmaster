import React, {Component} from 'react';
import {Route, matchPath, Switch} from 'react-router-dom';
import Header from './Header';
import Server from "../pages/server/Server";
import Tube from "../pages/tube/Tube";

class Layout extends Component {
	render() {
		const showSearch = matchPath(this.props.location.pathname, {
			path: '/:server',
			exact: true
		});

		const showPause = matchPath(this.props.location.pathname, {
			path: '/:server',
			exact: true
		});

		return (
			<div>
				<Header showSearch={showSearch} showPause={showPause} />
				<main className='container-fluid'>
					<Switch>
						<Route exact path="/" component={Server} />
						<Route exact path="/:server" component={Tube} />
					</Switch>
				</main>
			</div>
		);
	}
}

export default Layout;