import React, {Component} from 'react';
import {connect} from 'react-redux';
import validator from 'validator';
import _ from 'lodash';
import axios from 'axios';
import {Alert, Button, FormControl, ControlLabel, Modal, FormGroup, Form, Col} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

import {isBusy, notBusy} from '../actions/busy';
import {addServer} from '../actions/servers';
import {hideAddServerModal} from '../actions/addServerModal';

import AddServerForm from './AddServerForm';

import Preloader from '../include/Preloader';

const fields = ['name', 'host', 'port'];

class AddServerModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
			errorMessage: ''
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

	getError(id, validateEmpty) {
		const value = this.state[`form_${id}`];

		if (!validateEmpty && _.isUndefined(value)) {
			return null;
		}

		switch (id) {
			case 'name':
				if (value === '') {
					return 'error';
				}
				break;
			case 'host':
				if (!validator.isURL(value || '') && !validator.isIP(value || '') && value !== 'localhost') {
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
		const error = this.getError('name', true) || this.getError('host', true) || this.getError('port', true);
		if (error) {
			this.setError('Form invalid');
			return;
		}

		this.setState({
			errorMessage: ''
		});

		this.props.isBusy();

		AddServerModal
			.postServer(this.state.form_name, this.state.form_host, this.state.form_port)
			.then((server) => {
				this.props.addServer(server);
				this.close();
			})
			.catch((e) => {
				console.log(e);
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

	close() {
		this.props.notBusy();
		this.props.hideAddServerModal();
	}

	setError(errorMessage) {
		this.setState({
			errorMessage: errorMessage
		});

		this.errorTimeout();
	}

	errorTimeout() {
		setTimeout(() => {
			this.setState({
				errorMessage: ''
			});
		}, 5000);
	}

	static isErrorMessageValid(message) {
		return (_.isString(message) && !_.isEmpty(message));
	}

	onSubmit(values) {

	}

	render() {
		let alertBox = '';
		if (AddServerModal.isErrorMessageValid(this.state.errorMessage)) {
			alertBox = (
				<Alert bsStyle="warning">
					{this.state.errorMessage}
				</Alert>
			);
		}

		return (
			<span>
				<Modal show={this.props.addServerModal.show} onHide={()=>this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Add Server</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{alertBox}
						<AddServerForm onSubmit={this.submit} />
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
						<Preloader show={this.props.busy} />
						<Button onClick={()=>this.close()}>Close</Button>
						<Button bsStyle="primary" onClick={()=>this.addServer()}>Add</Button>
					</Modal.Footer>
				</Modal>
			</span>
		);
	}
}

export default connect((state, ownProps) => ({
	servers: state.servers,
	addServerModal: state.addServerModal
}), {
	addServer,
	hideAddServerModal,
	isBusy,
	notBusy
})(withRouter(AddServerModal));
