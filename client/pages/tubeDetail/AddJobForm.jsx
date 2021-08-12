import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {
	Form, Col, Row
} from 'react-bootstrap';
import {isNaN as _isNaN} from 'lodash-es';
import PropTypes from 'prop-types';

const validate = (values) => {
	const errors = {};

	if (!values.tube || values.tube === '') {
		errors.tube = 'Required';
	}

	if (!values.payload || values.payload === '') {
		errors.payload = 'Required';
	}

	if (values.priority !== undefined && values.priority !== '0' && !values.priority.match(/^[1-9][0-9]*$/)) {
		errors.priority = 'Invalid';
	}

	if (values.delay !== undefined && values.delay !== '0' && !values.delay.match(/^[1-9][0-9]*$/)) {
		errors.delay = 'Invalid';
	}

	if (values.ttr !== undefined && values.ttr !== '0' && !values.ttr.match(/^[1-9][0-9]*$/)) {
		errors.ttr = 'Invalid';
	}

	return errors;
};

const renderInput = ({
	input, className, type, placeholder, meta, label
}) => {
	return (
		<Form.Group className="mb-3" as={Row} controlId={input.name}>
			<Form.Label column sm={2}>
				{label}
			</Form.Label>
			<Col sm={10}>
				<Form.Control {...input} className={className} type={type} placeholder={placeholder} isInvalid={Boolean(meta.error) && meta.touched} />
				<Form.Control.Feedback type="invalid">
					{meta.error && meta.touched ? `${meta.error}` : ''}
				</Form.Control.Feedback>
			</Col>
		</Form.Group>
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

const renderTextArea = ({
	input, className, placeholder, meta, label
}) => {
	return (
		<Form.Group className="mb-3" as={Row} controlId={input.name}>
			<Form.Label column sm={2}>
				{label}
			</Form.Label>
			<Col sm={10}>
				<Form.Control as="textarea" {...input} className={className} placeholder={placeholder} isInvalid={Boolean(meta.error) && meta.touched} />
				<Form.Control.Feedback type="invalid">
					{meta.error && meta.touched ? `${meta.error}` : ''}
				</Form.Control.Feedback>
			</Col>
		</Form.Group>
	);
};

renderTextArea.propTypes = {
	input: PropTypes.object,
	className: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	meta: PropTypes.object,
	label: PropTypes.string
};

renderTextArea.defaultProps = {
	input: {},
	className: null,
	type: null,
	placeholder: null,
	meta: null,
	label: null
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
			<Form noValidate onSubmit={this.props.handleSubmit}>
				<Field className="form-control" name="tube" component={renderInput} type="text" label="Tube Name" value={this.props.defaultTube} />
				<Field className="form-control" name="payload" component={renderTextArea} type="text" label="Payload" />
				<Field className="form-control" name="priority" component={renderInput} type="text" label="Priority" />
				<Field className="form-control" name="delay" component={renderInput} type="text" label="Delay" />
				<Field className="form-control" name="ttr" component={renderInput} type="text" label="TTR" />
			</Form>
		);
	}
}

// const AddJobForm = (props) => {
// 	return (
// 		<Form noValidate onSubmit={props.handleSubmit}>
// 			<Field className="form-control" name="tube" component={renderInput} type="text" label="Tube Name" />
// 			<Field className="form-control" name="payload" component={renderTextArea} type="text" label="Payload" />
// 			<Field className="form-control" name="priority" component={renderInput} type="number" label="Priority" />
// 			<Field className="form-control" name="delay" component={renderInput} type="number" label="Delay" />
// 			<Field className="form-control" name="ttr" component={renderInput} type="number" label="TTR" />
// 		</Form>
// 	);
// }

AddJobForm.propTypes = {
	initialize: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	defaultTube: PropTypes.string.isRequired
};

const AddJobFormRedux = reduxForm({
	form: 'add_job',
	validate
})(AddJobForm);

export default AddJobFormRedux;
