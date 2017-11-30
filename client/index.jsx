import React from 'react';
import {render} from 'react-dom';
import 'react-bootstrap'
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss'
import './styles/style.scss';
import Root from './root';

if (module.hot) {
	module.hot.accept('./root', () => {
		render(<Root />, document.getElementById('app_main'));
	});
}

render(<Root />, document.getElementById('app_main'));
