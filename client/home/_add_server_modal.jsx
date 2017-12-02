import React, {Component} from 'react';
import {Button, FormControl, ControlLabel, Modal, FormGroup, Form, Col} from 'react-bootstrap';
import Preloader from '../include/preloader';
import validator from 'validator';
import _ from 'lodash';
import axios from 'axios';

class AddServerModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
	}

	handleFormChange(e) {
		const id = e.target.id;
		const state = {};
		state[`form_${id}`] = e.target.value;
		this.setState(state);
	}

	getValidationState(id) {
		return this.getError(id);
	}

	getError(id) {
		const value = this.state[`form_${id}`];
		if (_.isUndefined(value)) {
			return null;
		}

		switch (id) {
			case 'name':
				if (value === '') {
					return 'error';
				}
				break;
			case 'host':
				if (!validator.isURL(value) && !validator.isIP(value) && value !== 'localhost') {
					return 'error';
				}
				break;
			case 'port':
				const port = parseInt(value);
				if (!_.isFinite(port) || port <= 0 || port >= 65536) {
					return 'error';
				}
				break;
		}

		return null;
	}

	addServer() {
		const error = this.getError('name') || this.getError('host') || this.getError('port');
		if (error) {
			return;
		}

		this.setState({
			busy: true
		});

		AddServerModal
			.postServer(this.state.form_name, this.state.form_host, this.state.form_port)
			.then((server) => {
				this.props.onAddServer(server);
				this.setState({
					busy: false
				});
				this.close();
			})
			.catch(() => {

			});
	}

	static async postServer(name, host, port) {
		const result = await axios.post('/api/servers', {
			name,
			host,
			port,
		});
		return result.data.body.server;
	}

	show() {
		this.setState({
			show: true
		});
	}

	close() {
		this.setState({
			show: false
		});
	}

	render() {
		return (
			<span>
				<Button bsStyle="primary" onClick={()=>this.show()}>Add Server</Button>
				<Modal show={this.state.show} onHide={()=>this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Add Server</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form horizontal>
							<FormGroup controlId="name" validationState={this.getValidationState('name')}>
								<Col componentClass={ControlLabel} sm={2}>
									Name
								</Col>
								<Col sm={10}>
									<FormControl type="text" onChange={this.handleFormChange.bind(this)} placeholder="My cool beanstalk server" />
								</Col>
							</FormGroup>
							<FormGroup controlId="host" validationState={this.getValidationState('host')}>
								<Col componentClass={ControlLabel} sm={2}>
									Host
								</Col>
								<Col sm={10}>
									<FormControl type="text" onChange={this.handleFormChange.bind(this)} placeholder="127.0.0.1 / localhost / my-cool-beanstalk-server.com" />
								</Col>
							</FormGroup>
							<FormGroup controlId="port" validationState={this.getValidationState('port')}>
								<Col componentClass={ControlLabel} sm={2}>
									Port
								</Col>
								<Col sm={10}>
									<FormControl type="number" onChange={this.handleFormChange.bind(this)} placeholder="11300, port should be > 1 and < 65536" />
								</Col>
							</FormGroup>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.state.busy} />
						<Button onClick={()=>this.close()}>Close</Button>
						<Button bsStyle="primary" onClick={()=>this.addServer()}>Add</Button>
					</Modal.Footer>
				</Modal>
			</span>
		);
	}
}

export default AddServerModal;
