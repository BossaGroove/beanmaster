import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Button, Modal} from 'react-bootstrap';
import Preloader from '../include/preloader';
import axios from 'axios';

const isBusy = () => {
	return {
		type: 'IS_BUSY'
	}
};

const notBusy = () => {
	return {
		type: 'NOT_BUSY'
	}
};

const hideRemoveServerModal = () => {
	return {
		type: 'HIDE_REMOVE_SERVER_MODAL'
	}
};

const removeServer = (server) => {
	return {
		type: 'REMOVE_SERVER',
		payload: server
	}
};

class RemoveServerModal extends Component {
	constructor(props) {
		super(props);
	}

	static async removeServerRequest(server) {
		const result = await axios.delete(`/api/servers?host=${server.host}&port=${server.port}`);
		return result.data.body.server;
	}

	hideRemoveServerModal() {
		this.props.notBusy();
		this.props.hideRemoveServerModal();
	}

	removeServer() {
		this.props.isBusy();

		const server = {
			host: this.props.removeServerModal.server.host,
			port: this.props.removeServerModal.server.port
		};

		RemoveServerModal
			.removeServerRequest(server)
			.then(() => {
				this.hideRemoveServerModal();
				this.props.removeServer(server);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<Modal show={this.props.removeServerModal.show} onHide={()=>this.hideRemoveServerModal()}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Server</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Delete {this.props.removeServerModal.server.name} - {this.props.removeServerModal.server.host}:{this.props.removeServerModal.server.port}?
				</Modal.Body>
				<Modal.Footer>
					<Preloader show={this.props.busy} />
					<Button onClick={()=>this.hideRemoveServerModal()}>Close</Button>
					<Button bsStyle="danger" onClick={()=>this.removeServer()}>Delete</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default connect((state, ownProps) => ({
	removeServerModal: state.removeServerModal,
	busy: state.busy
}), {
	removeServer,
	hideRemoveServerModal,
	isBusy,
	notBusy
})(RemoveServerModal);
