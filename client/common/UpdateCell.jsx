import React, {Component} from 'react';

class UpdateCell extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cellStyle: 'update-cell',
			updated: false,
			delta: 0
		};
	}

	componentWillReceiveProps(nextProps) {
		const delta = nextProps.delta || 0;

		if (delta !== 0) {
			this.setBackgroundAnimation(nextProps.delta);
		}
	}

	setBackgroundAnimation(delta) {
		this.setState({
			cellStyle: 'update-cell updated',
			updated: true,
			delta: delta
		});
	}

	removeBackgroundAnimation() {
		this.setState({
			cellStyle: 'update-cell'
		});
	}

	removePopup() {
		this.setState({
			updated: false,
			delta: 0
		});
	}

	render() {
		let popup = '';

		if (this.state.updated) {
			let colorClass = 'decrease';
			let prefix = '';

			if (this.state.delta > 0) {
				colorClass = 'increase';
				prefix = '+';
			}

			popup = (
				<div className={'popup ' + colorClass} onAnimationEnd={() => { this.removePopup(); }}>
					{prefix}{this.state.delta}
				</div>
			);
		}

		return (
			<td className={this.state.cellStyle} onAnimationEnd={() => { this.removeBackgroundAnimation(); }}>
				{popup}
				<div className="container">
					{this.props.value}
				</div>
			</td>
		);
	}
}

export default UpdateCell;
