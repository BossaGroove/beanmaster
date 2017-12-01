import React, {Component} from 'react';
import Layout from './include/layout';

import {BrowserRouter, Route} from 'react-router-dom';

class Root extends Component {
	render() {
		return (
			<BrowserRouter>
				<Route path="/" component={Layout} />
			</BrowserRouter>
		);
	}
}

export default Root;