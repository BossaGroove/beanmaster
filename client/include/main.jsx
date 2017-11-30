import React, {Component} from 'react';

class Main extends Component {
	render() {
		return (
			<div>
				<main className='container-fluid'>{this.props.children}</main>
			</div>
		);
	}
}

export default Main;
