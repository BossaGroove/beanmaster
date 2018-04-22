import React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import {Button} from 'react-bootstrap';

const AddJobFormSubmitButton = ({ dispatch }) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('add_job'))}>Add</Button>
);

export default connect()(AddJobFormSubmitButton);