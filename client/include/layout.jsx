import React, {Component} from 'react';
import {Route, matchPath, Switch} from 'react-router-dom';
import Header from './header';
import Server from "../home/server";

class Layout extends Component {
	render() {
		const showSearch = matchPath(this.props.location.pathname, {
			path: '/page2'
		});

		return (
			<div>
				<Header showSearch={showSearch} showPause={false}/>
				<main className='container-fluid'>
					<Switch>
						<Route exact path="/" component={Server}/>
					</Switch>
				</main>
			</div>
		);
	}
}

export default Layout;