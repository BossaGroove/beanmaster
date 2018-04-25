import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import UpdateCell from '../../common/UpdateCell';

const TubeRow = (props) => (
	<tr>
		<td>
			<Link to={`/${props.host}:${props.port}/${props.tube.name}`}>
				{props.tube.name}
			</Link>
		</td>
		<UpdateCell value={props.tube['current-jobs-urgent']} delta={props.delta['current-jobs-urgent']} />
		<UpdateCell value={props.tube['current-jobs-ready']} delta={props.delta['current-jobs-ready']} />
		<UpdateCell value={props.tube['current-jobs-reserved']} delta={props.delta['current-jobs-reserved']} />
		<UpdateCell value={props.tube['current-jobs-delayed']} delta={props.delta['current-jobs-delayed']} />
		<UpdateCell value={props.tube['current-jobs-buried']} delta={props.delta['current-jobs-buried']} />
		<UpdateCell value={props.tube['total-jobs']} delta={props.delta['total-jobs']} />
		<UpdateCell value={props.tube['current-using']} delta={props.delta['current-using']} />
		<UpdateCell value={props.tube['current-watching']} delta={props.delta['current-watching']} />
		<UpdateCell value={props.tube['current-waiting']} delta={props.delta['current-waiting']} />
		<UpdateCell value={props.tube['cmd-delete']} delta={props.delta['cmd-delete']} />
		<UpdateCell value={props.tube['cmd-pause-tube']} delta={props.delta['cmd-pause-tube']} />
		<UpdateCell value={props.tube.pause} delta={props.delta.pause} />
		<UpdateCell value={props.tube['pause-time-left']} delta={props.delta['pause-time-left']} />
	</tr>
);

TubeRow.propTypes = {
	host: PropTypes.string.isRequired,
	port: PropTypes.string.isRequired,
	tube: PropTypes.object.isRequired,
	delta: PropTypes.object.isRequired
};

export default TubeRow;
