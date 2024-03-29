import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {Button, Modal, Alert} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

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

	static async postServer(name, host, port) {
		const result = await axios.post('/api/servers', {
			name,
			host,
			port,
		});

		return result.data.body.server;
	}

	onSubmit(values) {
		this.props.isBusy();

		this.addServer(values)
			.then(() => {
				this.close();
			})
			.catch((e) => {
				this.props.notBusy();
				this.setState({
					alert: e.response.data.meta.error
				});
			});
	}

	async addServer({name, host, port}) {
		const server = await AddServerModal.postServer(name, host, port);
		this.props.addServer(server);
	}

	close() {
		this.props.notBusy();
		this.props.hideAddServerModal();
		this.hideAlert();
	}

	hideAlert() {
		this.setState({
			alert: null
		});
	}

	render() {
		let alertMsg = null;

		if (this.state.alert) {
			alertMsg = (
				<Alert variant="danger" onClose={() => { this.hideAlert(); }} dismissible>
					{this.state.alert}
				</Alert>
			);
		}

		return (
			<Modal show={this.props.addServerModal.show} onHide={() => this.close()} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Add Server</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{alertMsg}
					<AddServerForm onSubmit={(values) => { this.onSubmit(values); }} />
				</Modal.Body>
				<Modal.Footer>
					<Preloader show={this.props.busy} />
					<Button variant="secondary" onClick={() => this.close()}>Close</Button>
					<AddServerFormSubmitButton />
				</Modal.Footer>
			</Modal>
		);
	}
}

AddServerModal.propTypes = {
	busy: PropTypes.bool.isRequired,
	addServerModal: PropTypes.object.isRequired,
	addServer: PropTypes.func.isRequired,
	hideAddServerModal: PropTypes.func.isRequired,
	isBusy: PropTypes.func.isRequired,
	notBusy: PropTypes.func.isRequired
};


export default connect((state) => ({
	busy: state.busy,
	addServerModal: state.addServerModal
}), {
	addServer,
	hideAddServerModal,
	isBusy,
	notBusy
})(withRouter(AddServerModal));
