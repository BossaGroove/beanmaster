import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {Button, Modal, Alert} from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

import {isBusy, notBusy} from '../actions/busy';
// import {addServer} from '../../actions/servers';

import SearchJobForm from './SearchJobForm';
import SearchJobFormSubmitButton from './SearchJobFormSubmitButton';

import Preloader from '../include/Preloader';
import {hideSearchJobModal} from "../actions/searchJobModal";

class SearchJobModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alert: null
		};
	}

	close() {
		this.props.notBusy();
		this.props.hideSearchJobModal();
		this.hideAlert();
	}

	hideAlert() {
		this.setState({
			alert: null
		});
	}

	onSubmit(values) {
		this.props.isBusy();

		// this.addServer(values)
		// 	.then(() => {
		// 		this.close();
		// 	})
		// 	.catch((e) => {
		// 		this.setState({
		// 			alert: e.response.data.meta.error
		// 		});
		// 	});
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
				<Modal show={this.props.searchJobModal.show} onHide={()=>this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Search job</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{alert}
						<SearchJobForm onSubmit={this.onSubmit.bind(this)} />
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.props.busy} />
						<Button onClick={()=>this.close()}>Close</Button>
						<SearchJobFormSubmitButton />
					</Modal.Footer>
				</Modal>
			</span>
		);
	}
}

export default connect((state, ownProps) => ({
	searchJobModal: state.searchJobModal
}), {
	isBusy,
	notBusy,
	hideSearchJobModal
})(withRouter(SearchJobModal));
