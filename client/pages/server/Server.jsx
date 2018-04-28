import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Button} from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

import {initServers} from '../../actions/servers';
import {showAddServerModal} from '../../actions/addServerModal';
import {unsetServer} from '../../actions/currentServer';
import {destroyServerRow} from '../../actions/serverRow';

import ServerRow from './ServerRow';
import AddServerModal from './AddServerModal';
import RemoveServerModal from './RemoveServerModal';


class Server extends Component {
	constructor(props) {
		super(props);
		props.unsetServer();
	}

	static async getServers() {
		const result = await axios.get('/api/servers');
		return result.data.body.servers;
	}

	componentWillMount() {
		this.init();
	}

	componentWillUnmount() {
		this.props.destroyServerRow();
	}

	init() {
		Server.getServers().then((servers) => {
			this.props.initServers(servers);
		});
	}

	showAddServerModal() {
		this.props.showAddServerModal();
	}

	render() {
		return (
			<div>
				<h1>Servers</h1>
				<Table responsive striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Host</th>
							<th>Port</th>
							<th>Connections</th>
							<th>Server Version</th>
							<th>Total Jobs</th>
							<th>PID</th>
							<th>Up time</th>
							<th>View</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{this.props.servers.map((server, i) => {
							return (
								<ServerRow key={i} name={server.name} host={server.host} port={server.port} />
							);
						})}
					</tbody>
				</Table>
				<Button bsStyle="primary" onClick={() => this.showAddServerModal()}>Add Server</Button>
				<AddServerModal />
				<RemoveServerModal />
			</div>
		);
	}
}

Server.propTypes = {
	servers: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			host: PropTypes.string,
			port: PropTypes.number,
		})
	).isRequired,
	initServers: PropTypes.func.isRequired,
	unsetServer: PropTypes.func.isRequired,
	destroyServerRow: PropTypes.func.isRequired,
	showAddServerModal: PropTypes.func.isRequired
};

export default connect((state) => ({
	servers: state.servers
}), {
	initServers,
	unsetServer,
	destroyServerRow,
	showAddServerModal
})(Server);
