import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
	Table, Button, SplitButton, DropdownButton, Dropdown, Row, Col
} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {get, isUndefined} from 'lodash-es';
import PropTypes from 'prop-types';

import UpdateCell from '../../common/UpdateCell';
import Preloader from '../../include/Preloader';

import {setServer} from '../../actions/currentServer';
import {isBusy, notBusy} from '../../actions/busy';

import {showAddJobModal} from '../../actions/addJobModal';
import {dispatchTubeDetail, destroyTubeDetail} from '../../actions/tubeDetail';
import AddJobModal from './AddJobModal';

import tubeCss from '../../styles/page/tube.scss';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons'

class TubeDetail extends Component {
	constructor(props) {
		super(props);
		const serverInfo = this.props.match.params.server.split(':');
		const {tube} = this.props.match.params;

		this.state = {
			host: serverInfo[0],
			port: serverInfo[1],
			tube,
			title: '',
			stat: null,
			paused: false
		};
	}

	static getDelta(oldStat, currentStat) {
		const tubeInfoDelta = {};
		const statsDelta = {};

		for (const key of Object.keys(currentStat.tubeInfo)) {
			if (!isUndefined(oldStat.tubeInfo) && !isUndefined(oldStat.tubeInfo[key])) {
				tubeInfoDelta[key] = currentStat.tubeInfo[key] - oldStat.tubeInfo[key];
			} else {
				tubeInfoDelta[key] = 0;
			}
		}

		for (const action of Object.keys(currentStat.stats)) {
			statsDelta[action] = {
				stat: {}
			};

			if (currentStat.stats[action]) {
				for (const key of Object.keys(currentStat.stats[action].stat)) {
					if (!isUndefined(get(oldStat, `stats[${action}].stat[${key}]`, undefined))) {
						statsDelta[action].stat[key] = currentStat.stats[action].stat[key] - oldStat.stats[action].stat[key];
					} else {
						statsDelta[action].stat[key] = 0;
					}
				}
			}
		}

		return {
			tubeInfo: tubeInfoDelta,
			stats: statsDelta
		};
	}

	static async getServerInfo({host, port}) {
		const result = await axios.get(`/api/servers/info?host=${host}&port=${port}`);
		return result.data.body.info;
	}

	static async getTubeStat({host, port, tube}) {
		const result = await axios.get(`/api/tubes/stat?host=${host}&port=${port}&tube=${tube}`);
		return result.data.body.stat;
	}

	static async kickJob({
		host, port, tube, value
	}) {
		await axios.post('/api/tubes/kick-job', {
			host,
			port,
			tube,
			value
		});
	}

	static async deleteJob({
		host, port, tube, value
	}) {
		await axios.post('/api/tubes/delete-job', {
			host,
			port,
			tube,
			value
		});
	}

	static async togglePause({host, port, tube}) {
		await axios.post('/api/tubes/toggle-pause', {
			host,
			port,
			tube
		});
	}

	componentDidMount() {
		this.isMount = true;
		this.init();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevProps.autoUpdate && this.props.autoUpdate) {
			this.performUpdate(this.props.autoUpdate);
		}
	}

	componentWillUnmount() {
		this.isMount = false;
		this.props.destroyTubeDetail();
		clearTimeout(this.timeoutHandler);
	}

	performUpdate(autoUpdateOverride) {
		if ((this.props.autoUpdate || autoUpdateOverride) && this.isMount) {
			this.timeoutHandler = setTimeout(() => {
				this.updateTube().then(() => {
					this.performUpdate();
				});
			}, 1000);
		}
	}

	init() {
		TubeDetail.getServerInfo(this.state).then((info) => {
			const serverInfo = {
				name: info.name || null,
				host: this.state.host,
				port: this.state.port
			};

			this.props.setServer(serverInfo);
		});

		this.updateTube().then(() => {});

		this.performUpdate();
	}

	async updateTube() {
		if (!this.isMount) {
			return;
		}

		const stat = await TubeDetail.getTubeStat(this.state);

		const statWithDelta = this.parseStat(stat);

		this.props.dispatchTubeDetail(statWithDelta);

		this.setPauseState(stat.tubeInfo['pause-time-left']);
	}

	setPauseState(pauseTimeLeft) {
		if (pauseTimeLeft > 0 && !this.state.paused) {
			this.setState({
				paused: true
			});
		} else if (pauseTimeLeft === 0 && this.state.paused) {
			this.setState({
				paused: false
			});
		}
	}

	parseStat(currentStat) {
		const oldStat = this.props.tubeDetail;

		return {
			current: currentStat,
			delta: TubeDetail.getDelta(get(oldStat, 'current', {}), currentStat)
		};
	}

	kickJobButton(value) {
		this.props.isBusy();

		TubeDetail.kickJob({
			host: this.state.host,
			port: this.state.port,
			tube: this.state.tube,
			value
		}).then(() => {

		}).catch(() => {

		}).finally(() => {
			this.props.notBusy();
		});
	}

	deleteJobButton(value) {
		this.props.isBusy();

		TubeDetail.deleteJob({
			host: this.state.host,
			port: this.state.port,
			tube: this.state.tube,
			value
		}).then(() => {

		}).catch(() => {

		}).finally(() => {
			this.props.notBusy();
		});
	}

	togglePauseButton() {
		this.props.isBusy();

		TubeDetail.togglePause(this.state).then(() => {

		}).catch(() => {

		}).finally(() => {
			this.props.notBusy();
		});
	}

	addJobButton() {
		this.props.showAddJobModal();
	}

	render() {
		let tubeStat = null;
		let jobStateStat = null;

		if (this.props.tubeDetail.current) {
			tubeStat = (
				<tr>
					<td>
						{this.props.tubeDetail.current.tubeInfo.name || '-'}
					</td>
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-jobs-urgent']} delta={this.props.tubeDetail.delta.tubeInfo['current-jobs-urgent']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-jobs-ready']} delta={this.props.tubeDetail.delta.tubeInfo['current-jobs-ready']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-jobs-reserved']} delta={this.props.tubeDetail.delta.tubeInfo['current-jobs-reserved']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-jobs-delayed']} delta={this.props.tubeDetail.delta.tubeInfo['current-jobs-delayed']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-jobs-buried']} delta={this.props.tubeDetail.delta.tubeInfo['current-jobs-buried']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['total-jobs']} delta={this.props.tubeDetail.delta.tubeInfo['total-jobs']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-using']} delta={this.props.tubeDetail.delta.tubeInfo['current-using']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-watching']} delta={this.props.tubeDetail.delta.tubeInfo['current-watching']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['current-waiting']} delta={this.props.tubeDetail.delta.tubeInfo['current-waiting']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['cmd-delete']} delta={this.props.tubeDetail.delta.tubeInfo['cmd-delete']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['cmd-pause-tube']} delta={this.props.tubeDetail.delta.tubeInfo['cmd-pause-tube']} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo.pause} delta={this.props.tubeDetail.delta.tubeInfo.pause} />
					<UpdateCell value={this.props.tubeDetail.current.tubeInfo['pause-time-left']} delta={this.props.tubeDetail.delta.tubeInfo['pause-time-left']} />
				</tr>
			);

			jobStateStat = (
				<div>
					{Object.keys(this.props.tubeDetail.current.stats).map((state) => {
						return (
							<div key={state}>
								<Row>
									<Col md={12}>
										<h4>Next job in &quot;{state.split('_')[1]}&quot; state</h4>
									</Col>
								</Row>
								{this.props.tubeDetail.current.stats[state]
									? (
										<Row>
											<Col md={2}>
												<p>
													<strong>Stats</strong>
												</p>
												<Table size="sm">
													<tbody>
														{Object.keys(this.props.tubeDetail.current.stats[state].stat).map((key) => {
															return (
																<tr key={key}>
																	<td>{key}</td>
																	{['tube', 'state'].includes(key)
																		? (
																			<td>{this.props.tubeDetail.current.stats[state].stat[key]}</td>
																		)
																		:																		(
																			<UpdateCell value={this.props.tubeDetail.current.stats[state].stat[key]} delta={this.props.tubeDetail.delta.stats[state].stat[key]} />
																		)
																	}
																</tr>
															);
														})}
													</tbody>
												</Table>
											</Col>
											<Col md={10}>
												<p>
													<strong>Job data:</strong>
												</p>
												<pre>
													<code>
														{this.props.tubeDetail.current.stats[state].payloadJson || this.props.tubeDetail.current.stats[state].payload}
													</code>
												</pre>
											</Col>
										</Row>
									)
									: null}
								<Row>
									<Col md={12}>
										<hr />
									</Col>
								</Row>
							</div>
						);
					})}
				</div>
			);
		}

		let title = `${this.props.currentServer.host}:${this.props.currentServer.port}`;
		if (this.props.currentServer.name) {
			title = `${this.props.currentServer.name} - ${title}`;
		}

		return (
			<Row>
				<Col>
					<Row>
						<Col>
							<h2 className="mb-3 p-2 border-bottom"><Link to={`/${this.state.host}:${this.state.port}`}>{title}</Link> / {this.state.tube}</h2>
						</Col>
					</Row>
					<Row>
						<Col>
							<Table responsive striped bordered hover>
								<thead>
								<tr>
									<th>Name</th>
									<th>Urgent</th>
									<th>Ready</th>
									<th>Reserved</th>
									<th>Delayed</th>
									<th>Buried</th>
									<th>Total</th>
									<th>Using</th>
									<th>Watching</th>
									<th>Waiting</th>
									<th>Delete (cmd)</th>
									<th>Pause (cmd)</th>
									<th>Pause (sec)</th>
									<th>Pause (left)</th>
								</tr>
								</thead>
								<tbody>
								{tubeStat}
								</tbody>
							</Table>
						</Col>
					</Row>
					<Row>
						<Col>
							<div id="tube-controls" className={tubeCss.tubeControl}>
								<strong>Actions:</strong>
								&nbsp;
								<ul>
									<li>
										<div>
											<SplitButton title={"Kick 1"} id="kick_job" variant="warning" disabled={this.props.busy} onClick={() => { this.kickJobButton(1); }}>
												{
													[10, 100, 1000, 10000, 100000].map((val) => {
														return (
															<Dropdown.Item key={`kick${val}`} onClick={() => { this.kickJobButton(val); }}>
																{/*<i className="glyphicon glyphicon-forward" />*/}
																&nbsp;Kick {val}
															</Dropdown.Item>
														);
													})
												}
											</SplitButton>
										</div>
									</li>
									<li>
										<div>
											<SplitButton title="Delete 1" id="delete_job" variant="danger" disabled={this.props.busy} onClick={() => { this.deleteJobButton(1); }}>
												{
													[10, 100, 1000, 10000, 100000].map((val) => {
														return (
															<Dropdown.Item key={`delete${val}`} onClick={() => { this.deleteJobButton(val); }}>
																{/*<i className="glyphicon glyphicon-trash" />*/}
																&nbsp;Delete {val}
															</Dropdown.Item>
														);
													})
												}
											</SplitButton>
										</div>
									</li>
									<li>
										<Button onClick={() => { this.togglePauseButton(); }} disabled={this.props.busy}>
											&nbsp;{this.state.paused ? 'Unpause' : 'Pause'}
										</Button>
									</li>
									<li>
										<Button variant="success" disabled={this.props.busy} onClick={() => { this.addJobButton(); }}>
											&nbsp;Add Job
										</Button>
									</li>
									<li>
										<Preloader show={this.props.busy} />
									</li>
								</ul>
							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<hr />
						</Col>
					</Row>
					<Row>
						<Col>
							{jobStateStat}
							<AddJobModal defaultTube={this.state.tube} />
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

TubeDetail.propTypes = {
	busy: PropTypes.bool.isRequired,
	match: PropTypes.object.isRequired,
	currentServer: PropTypes.object.isRequired,
	tubeDetail: PropTypes.object.isRequired,
	autoUpdate: PropTypes.bool.isRequired,
	showAddJobModal: PropTypes.func.isRequired,
	setServer: PropTypes.func.isRequired,
	isBusy: PropTypes.func.isRequired,
	notBusy: PropTypes.func.isRequired,
	dispatchTubeDetail: PropTypes.func.isRequired,
	destroyTubeDetail: PropTypes.func.isRequired
};

export default connect((state) => ({
	busy: state.busy,
	autoUpdate: state.autoUpdate,
	currentServer: state.currentServer,
	tubeDetail: state.tubeDetail
}), {
	showAddJobModal,
	setServer,
	isBusy,
	notBusy,
	dispatchTubeDetail,
	destroyTubeDetail
})(TubeDetail);
