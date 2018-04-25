import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {ControlLabel, FormGroup, Form, Col} from 'react-bootstrap';
import {isNaN as _isNaN} from 'lodash-es';

const validate = (values) => {
	const errors = {};

	if (!values.tube || values.tube === '') {
		errors.tube = 'Required';
	}

	if (!values.payload || values.payload === '') {
		errors.payload = 'Required';
	}

	if (values.priority !== '' && _isNaN(values.priority)) {
		errors.priority = 'Invalid';
	}

	if (values.delay !== '' && _isNaN(values.delay)) {
		errors.delay = 'Invalid';
	}

	if (values.ttr !== '' && _isNaN(values.ttr)) {
		errors.ttr = 'Invalid';
	}

	return errors;
};

const renderInput = ({input, className, type, placeholder, meta, label}) => {
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

const renderTextArea = ({input, className, type, placeholder, meta, label}) => {
	return (
		<FormGroup controlId={input.name} validationState={meta.error && meta.touched ? 'error' : null}>
			<Col componentClass={ControlLabel} sm={2}>
				{label} {meta.error && meta.touched ? `* ${meta.error}` : ''}
			</Col>
			<Col sm={10}>
				<textarea {...input} className={className} placeholder={placeholder} />
			</Col>
		</FormGroup>
	);
};

class AddJobForm extends Component {
	constructor(props) {
		super(props);
		this.props.initialize({
			tube: this.props.defaultTube
		});
	}

	render() {
		return (
			<Form horizontal onSubmit={this.props.handleSubmit}>
				<Field className="form-control" name="tube" component={renderInput} type="text" label="Tube Name" value={this.props.defaultTube} />
				<Field className="form-control" name="payload" component={renderTextArea} type="text" label="Payload" />
				<Field className="form-control" name="priority" component={renderInput} type="number" label="Priority" />
				<Field className="form-control" name="delay" component={renderInput} type="number" label="Delay" />
				<Field className="form-control" name="ttr" component={renderInput} type="number" label="TTR" />
			</Form>
		);
	}
}

AddJobForm = reduxForm({
	form: 'add_job',
	validate
})(AddJobForm);

export default AddJobForm;
