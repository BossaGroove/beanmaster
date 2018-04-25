import React from 'react';
import {connect} from 'react-redux';
import actions from "redux-form/es/actions";
import {Button} from 'react-bootstrap';
const submit = actions.submit;

const AddJobFormSubmitButton = ({dispatch}) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('add_job'))}>Add</Button>
);

export default connect()(AddJobFormSubmitButton);
