import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import UpdateCell from '../common/UpdateCell';

class TubeRow extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<tr>
				<td>
					<Link to={`/${this.props.host}:${this.props.port}/${this.props.tube.name}`}>
						{this.props.tube.name}
					</Link>
				</td>
				<UpdateCell value={this.props.tube['current-jobs-urgent']} delta={this.props.delta['current-jobs-urgent']} />
				<UpdateCell value={this.props.tube['current-jobs-ready']} delta={this.props.delta['current-jobs-ready']} />
				<UpdateCell value={this.props.tube['current-jobs-reserved']} delta={this.props.delta['current-jobs-reserved']} />
				<UpdateCell value={this.props.tube['current-jobs-delayed']} delta={this.props.delta['current-jobs-delayed']} />
				<UpdateCell value={this.props.tube['current-jobs-buried']} delta={this.props.delta['current-jobs-buried']} />
				<UpdateCell value={this.props.tube['total-jobs']} delta={this.props.delta['total-jobs']} />
				<UpdateCell value={this.props.tube['current-using']} delta={this.props.delta['current-using']} />
				<UpdateCell value={this.props.tube['current-watching']} delta={this.props.delta['current-watching']} />
				<UpdateCell value={this.props.tube['current-waiting']} delta={this.props.delta['current-waiting']} />
				<UpdateCell value={this.props.tube['cmd-delete']} delta={this.props.delta['cmd-delete']} />
				<UpdateCell value={this.props.tube['cmd-pause-tube']} delta={this.props.delta['cmd-pause-tube']} />
				<UpdateCell value={this.props.tube['pause']} delta={this.props.delta['pause']} />
				<UpdateCell value={this.props.tube['pause-time-left']} delta={this.props.delta['pause-time-left']} />
			</tr>
		);
	}
}

export default connect((state, ownProps) => ({
}), {
})(TubeRow);
