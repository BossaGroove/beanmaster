import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Button} from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import TubeRow from './TubeRow';

import {setServer} from "../../actions/currentServer";

class Tube extends Component {
	constructor(props) {
		super(props);
		const serverInfo = this.props.match.params.server.split(':');
		this.state = {
			host: serverInfo[0],
			port: serverInfo[1],
			title: '',
			tubes: []
		};
		props.setServer({
			host: serverInfo[0],
			port: serverInfo[1]
		})
	}

	componentWillUpdate(nextProps) {
		if (nextProps.autoUpdate !== this.props.autoUpdate && nextProps.autoUpdate) {
			this.performUpdate(nextProps.autoUpdate);
		}
	}

	componentWillMount() {
		this.isMount = true;
		this.init();
	}

	componentWillUnmount() {
		this.isMount = false;
	}

	performUpdate(autoUpdateOverride) {
		if (this.props.autoUpdate || autoUpdateOverride) {
			setTimeout(() => {
				this.updateTubes().then(() => {
					this.performUpdate();
				});
			}, 1000);
		}
	}

	init() {
		this.getServerInfo(this.state.host, this.state.port).then((info) => {
			if (info.name) {
				this.setState({
					title: `${info.name} - ${info.host}:${info.port}`
				});
			} else {
				this.setState({
					title: `${info.host}:${info.port}`
				});
			}
		});

		this.updateTubes().then(() => {});

		this.performUpdate();
	}

	async updateTubes() {
		if (!this.isMount) {
			return;
		}

		const server = await this.getTubes(this.state.host, this.state.port);

		const tubes = this.parseTubes(server.tubesInfo);

		this.setState({
			tubes: tubes
		});

		return server;
	}

	async getServerInfo(host, port) {
		const result = await axios.get(`/api/servers/info?host=${host}&port=${port}`);
		console.log(result.data.body);
		return result.data.body.info;
	}

	async getTubes(host, port) {
		const result = await axios.get(`/api/servers/tubes?host=${host}&port=${port}`);
		return result.data.body;
	}

	parseTubes(currentTubes) {
		const oldTubes = this.state.tubes;

		return currentTubes.map((currentTube) => {
			const oldTube = _.find(oldTubes, (oldTube) => {
				return (oldTube.current.name === currentTube.name);
			});

			return {
				current: currentTube,
				delta: Tube.getDelta(_.get(oldTube, 'current', {}), currentTube)
			};
		});
	}

	static getDelta(oldTube, currentTube) {
		const delta = {};
		for (let key of Object.keys(currentTube)) {
			if (!_.isUndefined(oldTube[key])) {
				delta[key] = currentTube[key] - oldTube[key];
			} else {
				delta[key] = 0;
			}
		}
		return delta;
	}

	render() {
		return (
			<div>
				<h1>{this.state.title}</h1>
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
						{this.state.tubes.map((tube, i) => {
							return (
								<TubeRow key={i} host={this.state.host} port={this.state.port} tube={tube.current} delta={tube.delta}/>
							);
						})}
					</tbody>
				</Table>
				<Button className="btn-primary" onClick={() => {this.updateTubes().then(() => {}).catch((e) => {})}}>Update</Button>
			</div>
		);
	}
}


export default connect((state, ownProps) => ({
	autoUpdate: state.autoUpdate
}), {
	setServer
})(Tube);