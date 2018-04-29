import React from 'react';
import {connect} from 'react-redux';
import actions from 'redux-form/es/actions';
import {Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
const {submit} = actions;

const AddServerFormSubmitButton = ({dispatch}) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('add_server'))}>Add</Button>
);

AddServerFormSubmitButton.propTypes = {
	dispatch: PropTypes.func.isRequired
};

export default connect()(AddServerFormSubmitButton);
