import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class UpdateCell extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<td>
				{this.props.value}
			</td>
		);
	}
}

export default connect((state, ownProps) => ({
}), {
})(UpdateCell);
