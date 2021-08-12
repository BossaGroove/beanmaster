import React from 'react';
import {connect} from 'react-redux';
import actions from 'redux-form/es/actions';
import {Button} from 'react-bootstrap';
import PropTypes from 'prop-types';

const {submit} = actions;

const AddJobFormSubmitButton = ({dispatch}) => (
	<Button variant="primary" onClick={() => dispatch(submit('add_job'))}>Add</Button>
);

AddJobFormSubmitButton.propTypes = {
	dispatch: PropTypes.func.isRequired
};

export default connect()(AddJobFormSubmitButton);
