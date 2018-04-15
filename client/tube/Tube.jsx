import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Button} from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import TubeRow from './TubeRow';

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
	}

	componentWillMount() {
		this.init();
	}

	init() {
		this.updateTubes().then((server) => {
			if (server.name) {
				this.setState({
					title: `${server.name} - ${this.state.host}:${this.state.port}`
				});
			} else {
				this.setState({
					title: `${this.state.host}:${this.state.port}`
				});
			}
		});

		setInterval(() => {
			this.updateTubes().then(() => {});
		}, 1000);
	}

	async updateTubes() {
		const server = await this.getTubes(this.state.host, this.state.port);

		this.setState({
			tubes: this.parseTubes(server.tubesInfo)
		});

		return server;
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
			if (oldTube) {
				return {
					current: currentTube,
					delta: Tube.getDelta(oldTube.current, currentTube)
				}
			} else {
				return {
					current: currentTube,
					delta: {}
				}
			}
		});
	}

	static getDelta(oldTube, currentTube) {
		const output = {};
		for (let key of Object.keys(currentTube)) {
			output[key] = currentTube[key] - oldTube[key];
		}
		return output;
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
			</div>
		);
	}
}


export default connect((state, ownProps) => ({
}), {
})(Tube);