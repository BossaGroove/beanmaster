import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {
	ControlLabel, FormGroup, Form, Col
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

const SearchJobForm = (props) => (
	<Form horizontal onSubmit={props.handleSubmit}>
		<Field className="form-control" name="job_id" component={renderInput} type="text" label="Job ID" />
	</Form>
);

SearchJobForm.propTypes = {
	handleSubmit: PropTypes.func.isRequired
};


const SearchJobFormRedux = reduxForm({
	form: 'search_job',
	validate
})(SearchJobForm);

export default SearchJobFormRedux;
