import React, {Component} from 'react';
import {Table, Button} from 'react-bootstrap';
import ServerRow from './_server_row';
import AddServerModal from './_add_server_modal';
import axios from 'axios';

class Server extends Component {
	constructor() {
		super();
		this.state = {
			busy: false,
			servers: []
		};
	}

	componentWillMount() {
		this.init();
	}

	init() {
		this.getServers().then((servers) => {
			this.setState({
				servers: servers
			});
		});
	}

	async getServers() {
		const result = await axios.get('/api/servers');
		return result.data.body.servers;
	}

	pushServer(server) {
		const servers = this.state.servers;

		servers.push({
			name: server.name,
			host: server.host,
			port: server.port
		});

		this.setState({
			servers: servers
		});
	}

	onAddServer(server) {
		this.pushServer(server);
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
						{this.state.servers.map((server, i) => {
							return (
								<ServerRow key={i} name={server.name} host={server.host} port={server.port} />
							);
						})}
					</tbody>
				</Table>
				<AddServerModal onAddServer={this.onAddServer.bind(this)} />
			</div>
		);
	}
}

export default Server;