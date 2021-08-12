import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {
	Form, Col, Row
} from 'react-bootstrap';
import PropTypes from 'prop-types';

const validate = (values) => {
	const errors = {};

	if (!values.job_id || values.job_id === '') {
		errors.job_id = 'Required';
	} else if (isNaN(values.job_id)) {
		errors.job_id = 'Number only';
	}

	return errors;
};

const renderInput = ({
	input, className, type, placeholder, meta, label
}) => {
	return (
		<Form.Group as={Row} className="mb-3" controlId={input.name}>
			<Form.Label column sm={3}>
				{label}
			</Form.Label>
			<Col sm={9}>
				<Form.Control {...input} className={className} type={type} placeholder={placeholder} isInvalid={Boolean(meta.error) && meta.touched} isValid={!Boolean(meta.error)} />
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

const SearchJobForm = (props) => {
	return (
		<Form noValidate onSubmit={props.handleSubmit}>
			<Field className="form-control" name="job_id" component={renderInput} type="text" label="Job ID" />
		</Form>
	);
};

SearchJobForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired
};

const SearchJobFormRedux = reduxForm({
	form: 'search_job',
	validate
})(SearchJobForm);

export default SearchJobFormRedux;
