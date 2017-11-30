import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Header from './header';
import Main from './main';

class Server extends Component {
	constructor() {
		super();
		this.state = {
			showSearch: false,
			showPause: false
		};
	}

	toggleSearch() {
		this.setState({
			showSearch: !this.state.showSearch
		});
	}

	togglePause() {
		this.setState({
			showPause: !this.state.showPause
		});
	}

	render() {
		const {children} = this.props;
		return (
			<div>
				<Header showSearch={this.state.showSearch} showPause={this.state.showPause}/>
				<Main>
					{children}
				</Main>
			</div>
		);
	}
}

export default Server;