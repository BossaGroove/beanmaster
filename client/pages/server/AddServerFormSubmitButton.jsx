import React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import {Button} from 'react-bootstrap';

const AddServerFormSubmitButton = ({ dispatch }) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('add_server'))}>Add</Button>
);

export default connect()(AddServerFormSubmitButton);