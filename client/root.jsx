import React, {Component} from 'react';
import Server from './home/server';
import Layout from './include/layout';

import {BrowserRouter, Route} from 'react-router-dom';

class Root extends Component {
	render() {
		return (
			<BrowserRouter>
				<Layout>
					<div>
						<Route exact path="/" component={Server}/>
					</div>
				</Layout>
			</BrowserRouter>
		);
	}
}

export default Root;