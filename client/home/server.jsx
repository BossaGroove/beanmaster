import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initServer} from '../actions/servers';
import {Table, Button} from 'react-bootstrap';
import ServerRow from './_server_row';
import AddServerModal from './_add_server_modal';
import RemoveServerModal from './_remove_server_modal';
import axios from 'axios';

class Server extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy: false
		};
	}

	componentWillMount() {
		this.init();
	}

	init() {
		this.getServers().then((servers) => {
			this.props.initServer(servers);
		});
	}

	async getServers() {
		const result = await axios.get('/api/servers');
		return result.data.body.servers;
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
				<AddServerModal />
				<RemoveServerModal />
			</div>
		);
	}
}


export default connect((state, ownProps) => ({
	servers: state.servers
}), {
	initServer
})(Server);