import React from 'react'
import { Field, reduxForm } from 'redux-form';
import {Alert, Button, FormControl, ControlLabel, Modal, FormGroup, Form, Col} from 'react-bootstrap';

let AddServerForm = () => (
	<Form horizontal>
		<FormGroup controlId="name">
			<Col componentClass={ControlLabel} sm={2}>
				Name
			</Col>
			<Col sm={10}>
				<Field className="form-control" name="name" component="input" type="text" placeholder="My cool beanstalk server" />
			</Col>
		</FormGroup>
		<FormGroup controlId="host">
			<Col componentClass={ControlLabel} sm={2}>
				Host
			</Col>
			<Col sm={10}>
				<Field className="form-control" name="host" component="input" type="text" placeholder="127.0.0.1 / localhost / my-cool-beanstalk-server.com" />
			</Col>
		</FormGroup>
		<FormGroup controlId="port">
			<Col componentClass={ControlLabel} sm={2}>
				Port
			</Col>
			<Col sm={10}>
				<Field className="form-control" name="port" component="input" type="number" placeholder="11300, port should be > 1 and < 65536" />
			</Col>
		</FormGroup>
	</Form>
);

AddServerForm = reduxForm({
	form: 'add_server'
})(AddServerForm);

export default AddServerForm;