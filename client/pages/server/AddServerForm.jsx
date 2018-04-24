import React from 'react'
import { Field, reduxForm } from 'redux-form';
import { ControlLabel, FormGroup, Form, Col} from 'react-bootstrap';
import validator from 'validator';
import isFinite from 'lodash/isFinite';

const validate = (values) => {
	const errors = {};

	if (!values.name || values.name === '') {
		errors.name = 'Required';
	}

	if (!values.host || !validator.isURL(values.host || '') && !validator.isIP(values.host || '') && values.host !== 'localhost') {
		errors.host = 'Host invalid';
	}

	const port = parseInt(values.port);
	if (!values.port || !isFinite(port) || port <= 0 || port >= 65536 || !values.port.match(/[0-9]+/)) {
		errors.port = 'Port invalid';
	}

	return errors;
};

const renderInput = ({input, className, type, placeholder, meta, label}) => {
	return (
		<FormGroup controlId={input.name} validationState={meta.error && meta.touched?'error':null}>
			<Col componentClass={ControlLabel} sm={2}>
				{label} {meta.error && meta.touched?`* ${meta.error}`:''}
			</Col>
			<Col sm={10}>
			<input {...input} className={className} type={type} placeholder={placeholder} />
			</Col>
		</FormGroup>
	);
};

let AddServerForm = (props) => (
	<Form horizontal onSubmit={props.handleSubmit}>
		<Field className="form-control" name="name" component={renderInput} type="text" placeholder="My cool beanstalk server" label="Name" />
		<Field className="form-control" name="host" component={renderInput} type="text" placeholder="127.0.0.1 / localhost / my-cool-beanstalk-server.com" label="Host" />
		<Field className="form-control" name="port" component={renderInput} type="number" placeholder="11300, port should be > 1 and < 65536" label="Port" />
	</Form>
);

AddServerForm = reduxForm({
	form: 'add_server',
	validate
})(AddServerForm);

export default AddServerForm;