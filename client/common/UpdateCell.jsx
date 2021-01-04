import React, {Component} from 'react';
import PropTypes from 'prop-types';
import updateCellCss from '../styles/page/updateCell.scss';

class UpdateCell extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cellStyle: '',
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
			cellStyle: updateCellCss.updated,
			updated: true,
			delta: delta
		});
	}

	removeBackgroundAnimation() {
		this.setState({
			cellStyle: ''
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
			let colorClass = updateCellCss.decrease;
			let prefix = '';

			if (this.state.delta > 0) {
				colorClass = updateCellCss.increase;
				prefix = '+';
			}

			popup = (
				<div className={`${updateCellCss.popup} ${colorClass}`} onAnimationEnd={() => { this.removePopup(); }}>
					{prefix}{this.state.delta}
				</div>
			);
		}

		return (
			<td className={`${updateCellCss['update-cell']} ${this.state.cellStyle}`} onAnimationEnd={() => { this.removeBackgroundAnimation(); }}>
				{popup}
				<div className={updateCellCss.containerBox}>
					{this.props.value}
				</div>
			</td>
		);
	}
}

UpdateCell.propTypes = {
	delta: PropTypes.number,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string
	])
};

UpdateCell.defaultProps = {
	value: '-',
	delta: 0
};


export default UpdateCell;
