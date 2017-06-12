import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class MaterialSelect extends Component {
  constructor(props) {
    super(props);

    // this._handler = this._handler.bind(this);
  }

  _handler(e) {
    e.preventDefault();
    if (this.props.onChange && (typeof this.props.onChange === "function")) {
      this.props.onChange(e);
    }
  }

  componentDidMount() {
    let handler = this._handler.bind(this)
    let node = ReactDOM.findDOMNode(this.refs.dropdown);
    $(node).ready(function() {
      $(node).material_select();
      $(node).on('change', handler);
    })
  }

  componentDidUpdate() {
    let node = ReactDOM.findDOMNode(this.refs.dropdown);
    $(node).material_select();
  }


  render() {
    return (
      <select id={this.props.id}
              name={this.props.name}
              value={this.props.value}
              ref='dropdown'
              onChange={this._handler} >
        {this.props.children}
      </select>
    )
  }
}

export default MaterialSelect;
