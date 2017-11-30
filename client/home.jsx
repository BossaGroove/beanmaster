import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	render() {
		return (
			<div className="app">
				<header className="app-header">
					<h1 className="app-title">Welcome to Reactsssss</h1>
				</header>
				<p className="app-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<Link to="/home2" className="btn btn-primary">click!</Link>
				<i className="glyphicon glyphicon-music" />
				<Modal show={this.state.showModal} onHide={this.close.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close.bind(this)}>Close</Button>
					</Modal.Footer>
				</Modal>
				<br />
				<br />
				<Button onClick={()=>this.open()}>Show Modal</Button>
			</div>
		);
	}
}

export default Home;
