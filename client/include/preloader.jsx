import React, {Component} from 'react';
import preloader from '../assets/images/preloader.gif';

class Preloader extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className={`preloader ${this.props.show?'':'hidden'}`}>
				<img src={preloader} />
			</span>
		);
	}
}

export default Preloader;
