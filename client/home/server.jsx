import React, {Component} from 'react';
import {Table, Button, Modal, FormGroup, ControlLabel, FormControl, Form, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ServerRow from './_server_row';
import Preloader from '../include/preloader';
import axios from 'axios';

class Server extends Component {
	constructor() {
		super();
		this.state = {
			showAddServerModal: false,
			showRemoveServerModal: false,
			busy: false,
			servers: []
		};
	}

	componentWillMount() {
		this.init();
	}

	init() {
		this.getServers().then((servers) => {
			this.setState({
				servers: servers
			});
		});
	}

	async getServers() {
		const result = await axios.get('/api/servers');
		return result.data.body.servers;
	}

	toggleModal(modalId, show) {
		const stateObj = {};
		stateObj[modalId] = show;

		this.setState(stateObj);

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

	pushServer() {
		const servers = this.state.servers;

		servers.push({
			name: Math.random(),
			host: '127.0.0.1',
			port: 11300
		});

		this.setState({
			servers: servers
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
					<tbody>
						{this.state.servers.map((server, i) => {
							return (
								<ServerRow key={i} name={server.name} host={server.host} port={server.port} />
							);
						})}
					</tbody>
				</Table>
				<Button bsStyle="primary" onClick={()=>this.toggleModal('showAddServerModal', true)}>Add Server</Button>
				<Button bsStyle="primary" onClick={()=>this.pushServer()}>Add Server Test</Button>
				<Modal show={this.state.showAddServerModal} onHide={()=>this.toggleModal('showAddServerModal', false)}>
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
						<Button onClick={()=>this.toggleModal('showAddServerModal', false)}>Close</Button>
						<Button bsStyle="primary" onClick={()=>this.addServer()}>Add</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default Server;