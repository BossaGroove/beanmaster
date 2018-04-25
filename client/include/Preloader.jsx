import React, {Component} from 'react';
import preloader from '../assets/images/preloader.gif';

class Preloader extends Component {
	render() {
		return (
			<span className={`preloader ${this.props.show ? '' : 'hidden'}`}>
				<img alt="preloader" src={preloader} />
			</span>
		);
	}
}

export default Preloader;
