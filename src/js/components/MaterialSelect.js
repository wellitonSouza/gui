/* eslint-disable */
import React, { Component } from 'react';

class MaterialSelect extends Component {
    constructor(props) {
        super(props);
        this._handler = this._handler.bind(this);
    }

    _handler(e) {
        e.preventDefault();
        if (this.props.onChange && (typeof this.props.onChange === 'function')) {
            this.props.onChange(e);
        }
    }

    render() {
        const options = this.props.children;
        const { label, id, name, value, isDisable } = this.props;
        return (
            <div className="card-select-2">
                {label && (<label htmlFor={id}>{label}</label>)}
                <select id={id} name={name} value={value}
                        onChange={this._handler} disabled={isDisable}>
                    {options}
                </select>
            </div>);
    }
}

export default MaterialSelect;
