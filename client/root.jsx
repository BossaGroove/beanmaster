import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Layout from './include/Layout';

const Root = () => (
	<BrowserRouter>
		<Route path="/" component={Layout} />
	</BrowserRouter>
);

export default Root;
