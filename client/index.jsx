import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './reducers';
import {render} from 'react-dom';
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss'
import './styles/style.scss';
import Root from './root';

const store = createStore(rootReducer,
	(process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

if (module.hot) {
	module.hot.accept('./root', () => {
		render(
			<Provider store={store}>
				<Root />
			</Provider>
		,document.getElementById('app_main'));
	});
}

render(<Provider store={store}>
	<Root />
</Provider>, document.getElementById('app_main'));
