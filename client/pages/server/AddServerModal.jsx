import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {Button, Modal, Alert} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

import {isBusy, notBusy} from '../../actions/busy';
import {addServer} from '../../actions/servers';
import {hideAddServerModal} from '../../actions/addServerModal';

import AddServerForm from './AddServerForm';
import AddServerFormSubmitButton from './AddServerFormSubmitButton';

import Preloader from '../../include/Preloader';

class AddServerModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alert: null
		};
	}

	async addServer({name, host, port}) {
		const server = await AddServerModal.postServer(name, host, port);
		this.props.addServer(server);
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
		this.hideAlert();
	}

	onSubmit(values) {
		this.props.isBusy();

		this.addServer(values)
			.then(() => {
				this.close();
			})
			.catch((e) => {
				this.setState({
					alert: e.response.data.meta.error
				});
			});
	}

	hideAlert() {
		this.setState({
			alert: null
		});
	}

	render() {
		let alert = null;

		if (this.state.alert) {
			alert = (
				<Alert bsStyle="danger" onDismiss={this.hideAlert.bind(this)}>
					{this.state.alert}
				</Alert>
			);
		}

		return (
			<span>
				<Modal show={this.props.addServerModal.show} onHide={() => this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Add Server</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{alert}
						<AddServerForm onSubmit={this.onSubmit.bind(this)} />
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.props.busy} />
						<Button onClick={() => this.close()}>Close</Button>
						<AddServerFormSubmitButton />
					</Modal.Footer>
				</Modal>
			</span>
		);
	}
}

export default connect((state) => ({
	busy: state.busy,
	servers: state.servers,
	addServerModal: state.addServerModal
}), {
	addServer,
	hideAddServerModal,
	isBusy,
	notBusy
})(withRouter(AddServerModal));
