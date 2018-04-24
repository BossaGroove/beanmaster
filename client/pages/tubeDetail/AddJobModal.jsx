import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Alert from 'react-bootstrap/lib/Alert';
import {withRouter} from 'react-router-dom';

import {isBusy, notBusy} from '../../actions/busy';
import {hideAddJobModal} from '../../actions/addJobModal';

import AddJobForm from './AddJobForm';
import AddJobFormSubmitButton from './AddJobFormSubmitButton';

import Preloader from '../../include/Preloader';

class AddJobModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alert: null
		};
	}

	static async addJob({host, port, tube, priority, delay, ttr, payload}) {
		const result = await axios.post('/api/tubes/add-job', {
			host, port, tube, priority, delay, ttr, payload
		});

		return result.data.body.jobId;
	}

	close() {
		this.props.notBusy();
		this.props.hideAddJobModal();
		this.hideAlert();
	}

	onSubmit(values) {
		this.props.isBusy();

		AddJobModal.addJob({
			host: this.props.currentServer.host,
			port: this.props.currentServer.port,
			tube: values.tube,
			priority: values.priority,
			delay: values.delay,
			ttr: values.ttr,
			payload: values.payload
		})
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
				<Modal show={this.props.addJobModal.show} onHide={()=>this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Job</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{alert}
						<AddJobForm onSubmit={this.onSubmit.bind(this)} defaultTube={this.props.defaultTube} />
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.props.busy} />
						<Button onClick={()=>this.close()}>Close</Button>
						<AddJobFormSubmitButton />
					</Modal.Footer>
				</Modal>
			</span>
		);
	}
}

export default connect((state, ownProps) => ({
	busy: state.busy,
	currentServer: state.currentServer,
	addJobModal: state.addJobModal
}), {
	hideAddJobModal,
	isBusy,
	notBusy
})(withRouter(AddJobModal));
