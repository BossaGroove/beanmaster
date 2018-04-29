import React from 'react';
import {connect} from 'react-redux';
import actions from 'redux-form/es/actions';
import {Button} from 'react-bootstrap';
import PropTypes from 'prop-types';
const {submit} = actions;

const SearchJobFormSubmitButton = ({dispatch}) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('search_job'))}>Search</Button>
);

SearchJobFormSubmitButton.propTypes = {
	dispatch: PropTypes.func.isRequired
};

export default connect()(SearchJobFormSubmitButton);
