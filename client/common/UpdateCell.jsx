import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

const timeoutStyles = {
	enter: 5000,
	exit: 5000
};

const Highlight = ({children, show, onEntered }) => (
	<CSSTransition in={show} timeout={timeoutStyles} onEntered={onEntered} classNames="fade">
		{children}
	</CSSTransition>
);

class UpdateCell extends Component {
	constructor(props) {
		super(props);

		this.originalBackgroundColor = '';

		// console.log(ReactDOM.findDOMNode(this.refs.cell).style);
		this.state = {
			show: false,
			cellStyle: {
			}
		};

		this.oldValue = this.props.value;
	}

	static  hex(x) {
		return ('0' + parseInt(x).toString(16)).slice(-2);
	}

	static rgb2hex(rgb) {
		if (rgb.search('rgb') === -1) {
			return rgb;
		}
		const rgbMatch = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
		return '#' + UpdateCell.hex(rgbMatch[1]) + UpdateCell.hex(rgbMatch[2]) + UpdateCell.hex(rgbMatch[3]);
	}

	static lerpColor(a, b, amount) {
		let ah = parseInt(a.replace(/#/g, ''), 16),
			ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
			bh = parseInt(b.replace(/#/g, ''), 16),
			br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
			rr = ar + amount * (br - ar),
			rg = ag + amount * (bg - ag),
			rb = ab + amount * (bb - ab);

		return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
	}

	setBackgroundAnimation() {
		this.lerpAmount = 0;

		if (this.animation) {
			clearInterval(this.animation);
		}

		let originalColor = UpdateCell.rgb2hex(
			window.getComputedStyle(
				ReactDOM.findDOMNode(this.refs.cell).parentNode
			).getPropertyValue('background-color')
		);

		if (originalColor === '#000000') {
			originalColor = '#ffffff';
		}

		this.animation = setInterval(() => {
			this.setState({
				cellStyle: {
					backgroundColor: UpdateCell.lerpColor('#aaffaa', originalColor, this.lerpAmount)
				}
			});

			this.lerpAmount += 0.1;

			if (this.lerpAmount >= 1) {
				this.lerpAmount = 0;
				clearInterval(this.animation);
			}
		}, 50);
	}

	componentWillReceiveProps() {
		if (this.props.value !== this.oldValue && this.oldValue !== null) {
			this.setBackgroundAnimation();
		}

		this.oldValue = this.props.value;
	}

	onHighlighted() {
		// console.log('dfghf');
		// this.setState({
		// 	show: false
		// });

	}

	render() {
		const { show } = this.state;

		return (
			<td ref={"cell"} className="update-cell" style={this.state.cellStyle}>
				{/*<Highlight show={show} onEntered={this.onHighlighted.bind(this) }>*/}
					{/*<div className="highlight" />*/}
				{/*</Highlight>*/}
				<div className="container">
					{this.props.value}
				</div>
			</td>
		);
	}
}

export default connect((state, ownProps) => ({
}), {
})(UpdateCell);
