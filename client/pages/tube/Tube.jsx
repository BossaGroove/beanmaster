import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table} from 'react-bootstrap';
import axios from 'axios';
import {find as _find, get, isUndefined} from 'lodash-es';
import PropTypes from 'prop-types';
import TubeRow from './TubeRow';

import {setServer} from '../../actions/currentServer';
import {dispatchTubes, destroyTubes} from '../../actions/tubes';

class Tube extends Component {
	constructor(props) {
		super(props);
		const serverInfo = this.props.match.params.server.split(':');
		this.state = {
			host: serverInfo[0],
			port: serverInfo[1]
		};

		props.setServer({
			host: serverInfo[0],
			port: serverInfo[1]
		});
	}

	static async getServerInfo(host, port) {
		const result = await axios.get(`/api/servers/info?host=${host}&port=${port}`);
		return result.data.body.info;
	}

	static async getTubes(host, port) {
		const result = await axios.get(`/api/servers/tubes?host=${host}&port=${port}`);
		return result.data.body;
	}

	static getDelta(oldTube, currentTube) {
		const delta = {};
		for (const key of Object.keys(currentTube)) {
			if (!isUndefined(oldTube[key])) {
				delta[key] = currentTube[key] - oldTube[key];
			} else {
				delta[key] = 0;
			}
		}
		return delta;
	}

	componentWillMount() {
		this.isMount = true;
		this.init();
	}

	componentWillUpdate(nextProps) {
		if (nextProps.autoUpdate !== this.props.autoUpdate && nextProps.autoUpdate) {
			this.performUpdate(nextProps.autoUpdate);
		}
	}

	componentWillUnmount() {
		this.isMount = false;
		this.props.destroyTubes();
		clearTimeout(this.timeoutHandler);
	}

	async updateTubes() {
		const server = await Tube.getTubes(this.state.host, this.state.port);

		const tubes = this.parseTubes(server.tubesInfo);

		this.props.dispatchTubes(tubes);
	}

	performUpdate(autoUpdateOverride) {
		if ((this.props.autoUpdate || autoUpdateOverride) && this.isMount) {
			this.timeoutHandler = setTimeout(() => {
				this.updateTubes().then(() => {
					this.performUpdate();
				});
			}, 1000);
		}
	}

	init() {
		Tube.getServerInfo(this.state.host, this.state.port).then((info) => {
			const serverInfo = {
				name: info.name || null,
				host: this.state.host,
				port: this.state.port
			};

			this.props.setServer(serverInfo);
		});

		this.updateTubes().then(() => {});

		this.performUpdate();
	}

	parseTubes(currentTubes) {
		const oldTubes = this.props.tubes;

		return currentTubes.map((currentTube) => {
			const oldTube = _find(oldTubes, (_oldTube) => {
				return (_oldTube.current.name === currentTube.name);
			});

			return {
				current: currentTube,
				delta: Tube.getDelta(get(oldTube, 'current', {}), currentTube)
			};
		});
	}

	render() {
		let title = `${this.props.currentServer.host}:${this.props.currentServer.port}`;
		if (this.props.currentServer.name) {
			title = `${this.props.currentServer.name} - ${title}`;
		}

		return (
			<div>
				<h1>{title}</h1>
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
						{this.props.tubes.map((tube, i) => {
							return (
								<TubeRow key={i} host={this.props.currentServer.host} port={this.props.currentServer.port} tube={tube.current} delta={tube.delta} />
							);
						})}
					</tbody>
				</Table>
				{/* <Button className="btn-primary" onClick={() => {this.updateTubes().then(() => {}).catch((e) => {})}}>Update</Button> */}
			</div>
		);
	}
}

Tube.propTypes = {
	match: PropTypes.object.isRequired,
	autoUpdate: PropTypes.bool.isRequired,
	currentServer: PropTypes.object.isRequired,
	tubes: PropTypes.arrayOf(PropTypes.shape({
		current: PropTypes.object,
		delta: PropTypes.object
	})).isRequired,
	setServer: PropTypes.func.isRequired,
	dispatchTubes: PropTypes.func.isRequired,
	destroyTubes: PropTypes.func.isRequired,
};

export default connect((state) => ({
	autoUpdate: state.autoUpdate,
	currentServer: state.currentServer,
	tubes: state.tubes
}), {
	setServer,
	dispatchTubes,
	destroyTubes
})(Tube);
