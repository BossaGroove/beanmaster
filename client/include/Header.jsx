import React, {Component} from 'react';
import {connect} from 'react-redux';
import Navbar from 'react-bootstrap/lib/Navbar';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {Link} from 'react-router-dom';
import {showSearchJobModal} from '../actions/searchJobModal';
import {toggleAutoUpdate} from '../actions/autoUpdate';
import SearchJobModal from './SearchJobModal';

class Header extends Component {
	constructor(props) {
		super(props);
	}

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
				<Navbar inverse fluid={true}>
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

export default connect((state, ownProps) => ({
	autoUpdate: state.autoUpdate
}), {
	showSearchJobModal,
	toggleAutoUpdate
})(Header);
