import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import {showRemoveServerModal} from '../../actions/removeServerModal';
import {dispatchServerRow} from '../../actions/serverRow';

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
		this.getServerStat().then((serverInfo) => {
			if (!serverInfo) {
				return;
			}

			this.props.dispatchServerRow(this.props.host, this.props.port, {
				connections: serverInfo['current-connections'],
				version: serverInfo.version,
				totalJobs: serverInfo['total-jobs'],
				pid: serverInfo.pid,
				uptime: serverInfo.uptime
			});
		});
	}

	async getServerStat() {
		const result = await axios.get(`/api/servers/stat?host=${this.props.host}&port=${this.props.port}`);
		return result.data.body.stat;
	}

	render() {
		return (
			<tr>
				<td>{this.props.name}</td>
				<td>{this.props.host}</td>
				<td>{this.props.port}</td>
				<td>{_.get(this.props.serverRow, 'connections', '-')}</td>
				<td>{_.get(this.props.serverRow, 'version', '-')}</td>
				<td>{_.get(this.props.serverRow, 'totalJobs', '-')}</td>
				<td>{_.get(this.props.serverRow, 'pid', '-')}</td>
				<td>{_.get(this.props.serverRow, 'uptime', '-')}</td>
				<td>
					<Link to={`/${this.props.host}:${this.props.port}`}>
						<Button bsStyle="primary">View</Button>
					</Link>
				</td>
				<td>
					<Button bsStyle="danger" onClick={() => this.props.showRemoveServerModal({
						name: this.props.name,
						host: this.props.host,
						port: this.props.port
					})}>Delete</Button>
				</td>
			</tr>
		);
	}
}

export default connect((state, ownProps) => ({
	removeServerModal: state.removeServerModal,
	serverRow: state.serverRow[`${ownProps.host}:${ownProps.port}`]
}), {
	dispatchServerRow,
	showRemoveServerModal
})(ServerRow);
