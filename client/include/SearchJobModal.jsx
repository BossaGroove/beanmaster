import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import get from 'lodash/get';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Alert from 'react-bootstrap/lib/Alert';
import Table from 'react-bootstrap/lib/Table';
import {withRouter} from 'react-router-dom';

import {isBusy, notBusy} from '../actions/busy';

import SearchJobForm from './SearchJobForm';
import SearchJobFormSubmitButton from './SearchJobFormSubmitButton';

import Preloader from '../include/Preloader';
import {hideSearchJobModal} from '../actions/searchJobModal';

class SearchJobModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alert: null,
			jobStat: null
		};
	}

	setAlert({status, message}) {
		this.setState({
			alert: {
				status,
				message
			}
		});
	}

	close() {
		this.props.notBusy();
		this.props.hideSearchJobModal();
		this.hideAlert();
		this.setState({
			jobStat: null
		});
	}

	hideAlert() {
		this.setState({
			alert: null
		});
	}

	static async searchJob({host, port, jobId}) {
		const result = await axios.post('/api/servers/search', {
			host,
			port,
			job_id: jobId
		});

		return result.data.body;
	}

	static async kickJob({host, port, jobId}) {
		const result = await axios.post('/api/servers/kick', {
			host,
			port,
			job_id: jobId
		});

		return result.data.body;
	}

	search(values) {
		this.hideAlert();
		this.props.isBusy();

		SearchJobModal.searchJob({
			host: this.props.currentServer.host,
			port: this.props.currentServer.port,
			jobId: values.job_id
		})
			.then((data) => {
				if (!data.stat) {
					this.setAlert({
						status: 'warning',
						message: 'Job not found'
					});
				} else {
					this.setState({
						jobStat: data.stat
					});
				}
			})
			.catch((e) => {

			})
			.finally(() => {
				this.props.notBusy();
			});
	}

	kick(jobId) {
		this.props.isBusy();

		SearchJobModal.kickJob({
			host: this.props.currentServer.host,
			port: this.props.currentServer.port,
			jobId: jobId
		})
			.then((data) => {
				this.setAlert({
					status: 'success',
					message: 'Job kicked'
				});
			})
			.catch((e) => {
				if (get(e, 'response.data.meta.error') === 'NOT_FOUND') {
					this.setAlert({
						status: 'warning',
						message: 'Unable to kick job - job not found or not in delayed state'
					});
				} else {
					this.setAlert({
						status: 'warning',
						message: e.message
					});
				}
			})
			.finally(() => {
				this.props.notBusy();
			});
	}

	render() {
		let alert = null;

		if (this.state.alert) {
			alert = (
				<Alert bsStyle={this.state.alert.status} onDismiss={this.hideAlert.bind(this)}>
					{this.state.alert.message}
				</Alert>
			);
		}

		let stat = '';
		let kickJobButton = '';

		if (this.state.jobStat) {
			stat = (
				<div>
					<hr />
					<p>
						<strong>Stats</strong>
					</p>
					<Table condensed>
						<tbody>
							{Object.keys(this.state.jobStat).map((statKey) => {
								return (
									<tr key={statKey}>
										<td>{statKey}</td>
										<td>{this.state.jobStat[statKey]}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</div>
			);
			kickJobButton = (
				<Button bsStyle="danger" onClick={() => { this.kick(this.state.jobStat.id); }}>Kick Job</Button>
			);
		}

		return (
			<span>
				<Modal show={this.props.searchJobModal.show} onHide={() => this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>Search job</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{alert}
						<SearchJobForm onSubmit={this.search.bind(this)} />
						{stat}
					</Modal.Body>
					<Modal.Footer>
						<Preloader show={this.props.busy} />
						{kickJobButton}
						<Button onClick={() => this.close()}>Close</Button>
						<SearchJobFormSubmitButton />
					</Modal.Footer>
				</Modal>
			</span>
		);
	}
}

export default connect((state) => ({
	busy: state.busy,
	searchJobModal: state.searchJobModal,
	currentServer: state.currentServer
}), {
	isBusy,
	notBusy,
	hideSearchJobModal
})(withRouter(SearchJobModal));
