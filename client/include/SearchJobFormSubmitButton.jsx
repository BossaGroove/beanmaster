import React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import {Button} from 'react-bootstrap';

const SearchJobFormSubmitButton = ({ dispatch }) => (
	<Button bsStyle="primary" onClick={() => dispatch(submit('search_job'))}>Search</Button>
);

export default connect()(SearchJobFormSubmitButton);