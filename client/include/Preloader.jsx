import React from 'react';
import PropTypes from 'prop-types';
import preloader from '../assets/images/preloader.gif';

import preloaderCss from '../styles/common.scss';

const Preloader = (props) => (
	<span className={`${preloaderCss.preloader} ${props.show ? '' : 'd-none'}`}>
		<img alt="preloader" src={preloader} />
	</span>
);

Preloader.propTypes = {
	show: PropTypes.bool.isRequired
};

export default Preloader;
