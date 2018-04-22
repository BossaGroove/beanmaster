import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Button, Grid, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import UpdateCell from '../../common/UpdateCell';

import {setServer} from "../../actions/currentServer";

class TubeDetail extends Component {
	constructor(props) {
		super(props);
		const serverInfo = this.props.match.params.server.split(':');
		const tube = this.props.match.params.tube;

		this.state = {
			host: serverInfo[0],
			port: serverInfo[1],
			tube,
			title: '',
			stat: null
		};

		props.setServer({
			host: serverInfo[0],
			port: serverInfo[1]
		})
	}

	componentWillUpdate(nextProps) {
		if (nextProps.autoUpdate !== this.props.autoUpdate && nextProps.autoUpdate) {
			// this.performUpdate(nextProps.autoUpdate);
		}
	}

	componentWillMount() {
		this.isMount = true;
		this.init();
	}

	componentWillUnmount() {
		this.isMount = false;
	}

	async getServerInfo({host, port}) {
		const result = await axios.get(`/api/servers/info?host=${host}&port=${port}`);
		return result.data.body.info;
	}

	async getTubeStat({host, port, tube}) {
		const result = await axios.get(`/api/tubes/stat?host=${host}&port=${port}&tube=${tube}`);
		return result.data.body.stat;
	}

	init() {
		this.getServerInfo(this.state).then((info) => {
			if (info.name) {
				this.setState({
					title: `${info.name} - ${info.host}:${info.port}`
				});
			} else {
				this.setState({
					title: `${info.host}:${info.port}`
				});
			}
		}).catch((e) => {

		});

		this.updateTube().then(() => {});
	}

	async updateTube() {
		if (!this.isMount) {
			return;
		}

		const stat = await this.getTubeStat(this.state);

		const statWithDelta = this.parseStat(stat);

		console.log(statWithDelta);
		this.setState({
			stat: statWithDelta
		});
	}

	parseStat(currentStat) {
		const oldStat = this.state.stat;

		// console.log(currentStat);

		return {
			current: currentStat,
			delta: TubeDetail.getDelta(_.get(oldStat, 'current', {}), currentStat)
		}
	}

	static getDelta(oldStat, currentStat) {
		const tubeInfoDelta = {};
		const statsDelta = {};

		for (let key of Object.keys(currentStat.tubeInfo)) {
			if (!_.isUndefined(oldStat.tubeInfo) && !_.isUndefined(oldStat.tubeInfo[key])) {
				tubeInfoDelta[key] = currentStat.tubeInfo[key] - oldStat.tubeInfo[key];
			} else {
				tubeInfoDelta[key] = 0;
			}
		}

		for (let action of Object.keys(currentStat.stats)) {
			statsDelta[action] = {
				stat: {}
			};

			if (currentStat.stats[action]) {
				for (let key of Object.keys(currentStat.stats[action].stat)) {
					if (!_.isUndefined(_.get(oldStat, `stats[${action}].stat[${key}]`, undefined))) {
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
		}
	}

	render() {
		let tubeStat = null;
		let jobStateStat = null;

		if (this.state.stat) {
			tubeStat = (
				<tr>
					<td>
						{this.state.stat.current.tubeInfo.name}
					</td>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-jobs-urgent']} delta={this.state.stat.delta.tubeInfo['current-jobs-urgent']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-jobs-ready']} delta={this.state.stat.delta.tubeInfo['current-jobs-ready']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-jobs-reserved']} delta={this.state.stat.delta.tubeInfo['current-jobs-reserved']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-jobs-delayed']} delta={this.state.stat.delta.tubeInfo['current-jobs-delayed']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-jobs-buried']} delta={this.state.stat.delta.tubeInfo['current-jobs-buried']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['total-jobs']} delta={this.state.stat.delta.tubeInfo['total-jobs']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-using']} delta={this.state.stat.delta.tubeInfo['current-using']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-watching']} delta={this.state.stat.delta.tubeInfo['current-watching']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['current-waiting']} delta={this.state.stat.delta.tubeInfo['current-waiting']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['cmd-delete']} delta={this.state.stat.delta.tubeInfo['cmd-delete']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['cmd-pause-tube']} delta={this.state.stat.delta.tubeInfo['cmd-pause-tube']}/>
					<UpdateCell value={this.state.stat.current.tubeInfo.pause} delta={this.state.stat.delta.tubeInfo.pause}/>
					<UpdateCell value={this.state.stat.current.tubeInfo['pause-time-left']} delta={this.state.stat.delta.tubeInfo['pause-time-left']}/>
				</tr>
			);

			jobStateStat = (
				<div>
					{Object.keys(this.state.stat.current.stats).map((state) => {
						return (
							<div key={state} >
								<Row>
									<Col md={12}>
										<h4>Next job in "{state.split('_')[1]}" state</h4>
									</Col>
								</Row>
								{this.state.stat.current.stats[state]?
								(
									<Row>
										<Col md={2}>
											<p>
												<strong>Stats</strong>
											</p>
											<Table condensed>
												<tbody>
												{Object.keys(this.state.stat.current.stats[state].stat).map((key) => {
													return (
														<tr key={key}>
															<td>{key}</td>
															<UpdateCell value={this.state.stat.current.stats[state].stat[key]} delta={this.state.stat.delta.stats[state].stat[key]}/>
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
													{this.state.stat.current.stats[state].payloadJson || this.state.stat.current.stats[state].payload}
												</code>
											</pre>
										</Col>
									</Row>
								)
								:null}
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

		return (
			<div>
				<h1><Link to={`/${this.state.host}:${this.state.port}`}>{this.state.title}</Link> / {this.state.tube}</h1>
				<hr />
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
				<Button className="btn-primary" onClick={() => {this.updateTube().then(() => {}).catch((e) => {
					console.log(e);
				})}}>Update</Button>
				<hr />
				{jobStateStat}
			</div>
		);
	}
}


export default connect((state, ownProps) => ({
	autoUpdate: state.autoUpdate
}), {
	setServer
})(TubeDetail);