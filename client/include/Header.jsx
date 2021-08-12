import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSearch, faPause } from '@fortawesome/free-solid-svg-icons'
import {Navbar, Container, Button, Nav} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {showSearchJobModal} from '../actions/searchJobModal';
import {toggleAutoUpdate} from '../actions/autoUpdate';
import SearchJobModal from './SearchJobModal';
import navBarCss from '../styles/common/navBar.scss';

class Header extends Component {
	pause() {
		this.props.toggleAutoUpdate();
	}

	render() {
		let pauseStyle = 'outline-danger';
		if (!this.props.autoUpdate) {
			pauseStyle = 'danger';
		}

		return (
			<div>
				<Navbar bg="dark" expand="lg" variant="dark">
					<Container fluid>
						<Navbar.Brand className={navBarCss['navbar-brand']}>
							<Link to="/">Beanmaster</Link>
						</Navbar.Brand>
						<Navbar.Toggle aria-controls="responsive-navbar-nav" />
						<Navbar.Collapse>
							<Nav className="me-auto" />
							<Nav>
								<Button variant="primary" onClick={() => { this.props.showSearchJobModal(); }} className={`${this.props.showSearch ? '' : 'hidden'} me-lg-3 mb-3 mb-lg-0 mt-3 mt-lg-0`}>
									<FontAwesomeIcon icon={faSearch} />
								</Button>
								<Button variant={pauseStyle} onClick={() => { this.pause(); }} className={this.props.showPause ? '' : 'hidden'}>
									<FontAwesomeIcon icon={faPause} />
								</Button>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
				<SearchJobModal />
			</div>
		);
	}
}

Header.propTypes = {
	toggleAutoUpdate: PropTypes.func.isRequired,
	showSearchJobModal: PropTypes.func.isRequired,
	autoUpdate: PropTypes.bool.isRequired,
	showSearch: PropTypes.bool.isRequired,
	showPause: PropTypes.bool.isRequired
};

export default connect((state) => ({
	autoUpdate: state.autoUpdate
}), {
	showSearchJobModal,
	toggleAutoUpdate
})(Header);
