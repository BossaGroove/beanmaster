import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';

class ServerRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			info: {
				connections: '-',
				version: '-',
				totalJobs: '-',
				pid: '-',
				uptime: '-'
			}
		};
	}

	componentWillMount() {
		this.init();
	}

	init() {
		this.getServerInfo().then((serverInfo) => {
			if (!serverInfo) {
				return;
			}
			this.setState({
				info: {
					connections: serverInfo['current-connections'],
					version: serverInfo.version,
					totalJobs: serverInfo['total-jobs'],
					pid: serverInfo.pid,
					uptime: serverInfo.uptime
				}
			});
		});
	}

	async getServerInfo() {
		const result = await axios.get(`/api/servers/info?host=${this.props.host}&port=${this.props.port}`);
		return result.data.body.stat;
	}

	render() {
		return (
			<tr>
				<td>{this.props.name}</td>
				<td>{this.props.host}</td>
				<td>{this.props.port}</td>
				<td>{this.state.info.connections}</td>
				<td>{this.state.info.version}</td>
				<td>{this.state.info.totalJobs}</td>
				<td>{this.state.info.pid}</td>
				<td>{this.state.info.uptime}</td>
				<td>
					<Link to={`/${this.props.host}:${this.props.port}`}>
						<Button bsStyle="primary">View</Button>
					</Link>
				</td>
				<td>
					<Button bsStyle="danger">Delete</Button>
				</td>
			</tr>
		);
	}
}

export default ServerRow;