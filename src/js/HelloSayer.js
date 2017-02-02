import React from 'react';

class HelloSayer extends React.Component {
	render() {
		return <p>Hello -k- {this.props.name} -- updated!</p>;
	}
}

export default HelloSayer;
