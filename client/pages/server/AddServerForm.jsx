import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {
	ControlLabel, FormGroup, Form, Col
} from 'react-bootstrap';
import {isURL, isIP} from 'validator';
import {isFinite as _isFinite} from 'lodash-es';
import PropTypes from 'prop-types';

const validate = (values) => {
	const errors = {};

	if (!values.name || values.name === '') {
		errors.name = 'Required';
	}

	if (!values.host || !isURL(values.host || '') && !isIP(values.host || '') && values.host !== 'localhost') {
		errors.host = 'Host invalid';
	}

	const port = parseInt(values.port, 10);
	if (!values.port || !_isFinite(port) || port <= 0 || port >= 65536 || !values.port.match(/[0-9]+/)) {
		errors.port = 'Port invalid';
	}

	return errors;
};

const renderInput = ({
	input, className, type, placeholder, meta, label
}) => {
	return (
		<FormGroup controlId={input.name} validationState={meta.error && meta.touched ? 'error' : null}>
			<Col componentClass={ControlLabel} sm={2}>
				{label} {meta.error && meta.touched ? `* ${meta.error}` : ''}
			</Col>
			<Col sm={10}>
				<input {...input} className={className} type={type} placeholder={placeholder} />
			</Col>
		</FormGroup>
	);
};

renderInput.propTypes = {
	input: PropTypes.object,
	className: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	meta: PropTypes.object,
	label: PropTypes.string
};

renderInput.defaultProps = {
	input: {},
	className: null,
	type: null,
	placeholder: null,
	meta: null,
	label: null
};

const AddServerForm = (props) => (
	<Form horizontal onSubmit={props.handleSubmit}>
		<Field className="form-control" name="name" component={renderInput} type="text" placeholder="My cool beanstalk server" label="Name" />
		<Field className="form-control" name="host" component={renderInput} type="text" placeholder="127.0.0.1 / localhost / my-cool-beanstalk-server.com" label="Host" />
		<Field className="form-control" name="port" component={renderInput} type="number" placeholder="11300, port should be > 1 and < 65536" label="Port" />
	</Form>
);

AddServerForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired
};

const AddServerFormRedux = reduxForm({
	form: 'add_server',
	validate
})(AddServerForm);

export default AddServerFormRedux;
