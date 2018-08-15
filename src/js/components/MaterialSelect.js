import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class MaterialSelect extends Component {
  constructor(props) {
    super(props);
    this._handler = this._handler.bind(this)
  }

  _handler(e) {
    e.preventDefault();
    if (this.props.onChange && (typeof this.props.onChange === "function")) {
      this.props.onChange(e);
    }
  }

  render() {
    console.log("Material Select, this.props: ", this.props);
    let options = this.props.children; 
      return ( 
        <div className="card-select-2">
        { this.props.label && (<label htmlFor={this.props.id}>{this.props.label}</label>)}
        <select id={this.props.id} name={this.props.name} value={this.props.value} onChange={this._handler}>
          {options}
        </select>
        </div>)
  }
}

export default MaterialSelect;
