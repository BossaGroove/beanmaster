import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table, Button} from 'react-bootstrap';
import axios from 'axios';


class Tube extends Component {
	constructor(props) {
		super(props);
		const serverInfo = this.props.match.params.server.split(':');
		this.state = {
			host: serverInfo[0],
			port: serverInfo[1]
		};
	}

	componentWillMount() {
		this.init();
	}

	init() {
		this.getServer(this.state.host, this.state.port).then((servers) => {

		});
	}

	async getServer() {
		// console.log(this.props.match.params.server);
		// const result = await axios.get('/api/servers');
		// return result.data.body.servers;
	}

	render() {
		return (
			<div>
				<h1>{this.state.host}:{this.state.port}</h1>
			</div>
		);
	}
}


export default connect((state, ownProps) => ({
}), {
})(Tube);