import React, {Component} from 'react';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import axios from 'axios';

import {isBusy, notBusy} from '../../actions/busy';
import {hideRemoveServerModal} from '../../actions/removeServerModal';
import {removeServer} from '../../actions/servers';

import Preloader from '../../include/Preloader';

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
