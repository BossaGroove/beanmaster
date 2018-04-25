import React from 'react';
import {connect} from 'react-redux';
import actions from 'redux-form/es/actions';
import {Button} from 'react-bootstrap';
const submit = actions.submit;

const SearchJobFormSubmitButton = ({dispatch}) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('search_job'))}>Search</Button>
);

export default connect()(SearchJobFormSubmitButton);
