import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Navbar, Button, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {showSearchJobModal} from '../actions/searchJobModal';
import {toggleAutoUpdate} from '../actions/autoUpdate';
import SearchJobModal from './SearchJobModal';

class Header extends Component {
	pause() {
		this.props.toggleAutoUpdate();
	}

	render() {
		let pauseStyle = 'default';
		if (!this.props.autoUpdate) {
			pauseStyle = 'danger';
		}

		return (
			<div>
				<Navbar inverse fluid>
					<Navbar.Header>
						<Navbar.Brand>
							<Link to="/">Beanmaster</Link>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Navbar.Form pullRight>
							<Button onClick={() => { this.props.showSearchJobModal(); }} className={this.props.showSearch ? '' : 'hidden'}>
								<Glyphicon glyph="search" />
							</Button>
							{' '}
							<Button bsStyle={pauseStyle} onClick={() => { this.pause(); }} className={this.props.showPause ? '' : 'hidden'}>
								<Glyphicon glyph="pause" />
							</Button>
						</Navbar.Form>
					</Navbar.Collapse>
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
