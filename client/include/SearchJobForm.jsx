import React from 'react'
import { Field, reduxForm } from 'redux-form';
import { ControlLabel, FormGroup, Form, Col} from 'react-bootstrap';

const validate = (values) => {
	const errors = {};

	if (!values.job_id || values.job_id === '') {
		errors.job_id = 'Required';
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

let SearchJobForm = (props) => (
	<Form horizontal onSubmit={props.handleSubmit}>
		<Field className="form-control" name="job_id" component={renderInput} type="text" label="Job ID" />
	</Form>
);

SearchJobForm = reduxForm({
	form: 'search_job',
	validate
})(SearchJobForm);

export default SearchJobForm;