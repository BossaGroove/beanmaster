import React, {Component} from 'react';
import {Navbar, Button, Glyphicon} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Navbar inverse fluid={true}>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to="/">Beanmaster</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Navbar.Form pullRight>
						<Button className={this.props.showSearch?'':'hidden'}>
							<Glyphicon glyph="search" />
						</Button>
						{' '}
						<Button className={this.props.showPause?'':'hidden'}>
							<Glyphicon glyph="pause" />
						</Button>
					</Navbar.Form>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Header;