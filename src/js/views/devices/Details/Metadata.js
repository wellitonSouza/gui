import React, { Component } from 'react';

class Metadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };

        this.showMetadata = this.showMetadata.bind(this);
    }

    showMetadata() {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { attr } = this.props;
        const { open } = this.state;
        return (
            <div className="metadata-wrapper">
                {attr.metadata.map(item => (
                    open && (
                        <div className="line-metadata">
                            <div className="label">{item.label}</div>
                            <div className="value">{item.static_value}</div>
                        </div>
                    )
                ))}
                <div className="button" onClick={this.showMetadata}>
                    <i className={`fa ${open ? 'fa-angle-up' : 'fa-angle-down'}`} />
                </div>
            </div>
        );
    }
}

export default Metadata;
