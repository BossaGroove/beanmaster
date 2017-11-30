import React, {Component} from 'react';
import {Table, Button, Modal, FormGroup, ControlLabel, FormControl, Form, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Header from '../include/header';
import Preloader from '../include/preloader';

class Server extends Component {
	constructor() {
		super();
		this.state = {
			showModal: {
				addServer: false,
				removeServer: false
			}
		};
	}

	toggleModal(modalId, show) {
		const showModal = this.state.showModal;
		showModal[modalId] = show;

		this.setState({
			showModal: showModal
		});

		if (!show) {
			this.setState({
				busy: false
			});
		}
	}

	addServer() {
		this.setState({
			busy: true
		});
	}

	render() {
		return (
			<div>
				<h1>Servers</h1>
				<Table responsive striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Host</th>
							<th>Port</th>
							<th>Connections</th>
							<th>Server Version</th>
							<th>Total Jobs</th>
							<th>PID</th>
							<th>Up time</th>
							<th>View</th>
							<th>Delete</th>
						</tr>
					</thead>
				</Table>
				<Button bsStyle="primary" onClick={()=>this.toggleModal('addServer', true)}>Add Server</Button>
				<Modal show={this.state.showModal.addServer} onHide={()=>this.toggleModal('addServer', false)}>
					<Modal.Header closeButton>
						<Modal.Title>Add Server</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form horizontal>
							<FormGroup controlId="name">
								<Col componentClass={ControlLabel} sm={2}>
									Name
								</Col>
								<Col sm={10}>
									<FormControl type="text" placeholder="My cool beanstalk server" />
								</Col>
							</FormGroup>
							<FormGroup controlId="host">
								<Col componentClass={ControlLabel} sm={2}>
									Host
								</Col>
								<Col sm={10}>
									<FormControl type="text" placeholder="127.0.0.1 / localhost / my-cool-beanstalk-server.com" />
								</Col>
							</FormGroup>
							<FormGroup controlId="port">
								<Col componentClass={ControlLabel} sm={2}>
									Port
								</Col>
								<Col sm={10}>
									<FormControl type="number" placeholder="11300, port should be > 1 and < 65536" />
								</Col>
							</FormGroup>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.state.busy} />
						<Button onClick={()=>this.toggleModal('addServer', false)}>Close</Button>
						<Button bsStyle="primary" onClick={()=>this.addServer()}>Add</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default Server;