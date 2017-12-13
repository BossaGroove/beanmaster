import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {Button, Modal} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

import {isBusy, notBusy} from '../actions/busy';
import {addServer} from '../actions/servers';
import {hideAddServerModal} from '../actions/addServerModal';

import AddServerForm from './AddServerForm';
import AddServerFormSubmitButton from './AddServerFormSubmitButton';

import Preloader from '../include/Preloader';

class AddServerModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
	}

	addServer() {
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

	onSubmit(values) {
		console.log('onSubmit');
		console.log(values);
	}

	render() {
		return (
			<span>
				<Modal show={this.props.addServerModal.show} onHide={()=>this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Add Server</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<AddServerForm onSubmit={this.onSubmit} />
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.props.busy} />
						<Button onClick={()=>this.close()}>Close</Button>
						<AddServerFormSubmitButton />
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
