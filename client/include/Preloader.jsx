import React from 'react';
import PropTypes from 'prop-types';
import preloader from '../assets/images/preloader.gif';

const Preloader = (props) => (
	<span className={`preloader ${props.show ? '' : 'hidden'}`}>
		<img alt="preloader" src={preloader} />
	</span>
);

Preloader.propTypes = {
	show: PropTypes.bool.isRequired
};

export default Preloader;
