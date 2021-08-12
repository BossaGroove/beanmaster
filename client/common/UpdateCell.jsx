import React, {Component} from 'react';
import PropTypes from 'prop-types';
import updateCellCss from '../styles/page/updateCell.scss';

class UpdateCell extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cellStyle: '',
			delta: 0,
			updateDone: false
		};
	}

	componentDidUpdate(prevProps, prevState) {
		// if updated from outside, reset update done
		if (this.props.value !== prevProps.value || this.props.delta !== prevProps.delta) {
			this.setState({
				updateDone: false
			});
		}

		// trigger the animation if update allowed and delta is not 0
		if (!this.state.updateDone && this.props.delta !== 0) {
			this.setState({
				cellStyle: updateCellCss.updated,
				delta: this.props.delta,
				updateDone: true
			});
		}
	}

	removeBackgroundAnimation() {
		this.setState({
			cellStyle: ''
		});
	}

	removePopup() {
		this.setState({
			delta: 0
		});
	}

	render() {
		let popup = '';

		if (this.state.delta !== 0) {
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
