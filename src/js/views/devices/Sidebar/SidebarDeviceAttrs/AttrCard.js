import React, { PureComponent } from 'react';
import MaterialInput from 'Components/MaterialInput';

class AttrCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showMetadata: false,
            attr: {},
        };

        this.handleShowMetadata = this.handleShowMetadata.bind(this);
        this.handleChangeMetadata = this.handleChangeMetadata.bind(this);
    }

    componentDidMount() {
        const { attr } = this.props;
        this.setState({
            attr,
        });
    }

    handleShowMetadata() {
        this.setState(prevState => ({
            showMetadata: !prevState.showMetadata,
        }));
    }

    handleChangeMetadata(event) {
        const { attr } = this.state;
        const metadata = attr.metadata.map(meta => (
            meta.label === event.target.name
                ? { ...meta, static_value: event.target.value }
                : meta
        ));

        this.setState({
            attr: { ...attr, metadata },
        });
    }

    render() {
        const { showMetadata, attr } = this.state;
        console.log(attr);
        const metaLength = Object.prototype.hasOwnProperty.call(attr, 'metadata')
            ? attr.metadata.length
            : 0;
        const isDynamic = attr.type === 'dynamic';
        return (
            <div className="attr-card">
                <div className="attr-card-header">
                    <img src="images/icons/data_attrs-gray.png" alt="attrs-icon" />
                    <div className="attr-card-input-wrapper">
                        {
                            isDynamic
                                ? (<div>{attr.label}</div>)
                                : (
                                    <MaterialInput
                                        className="attr-card-input"
                                        name="name"
                                        maxLength={40}
                                        value={attr.static_value}
                                    >
                                        {attr.label}
                                    </MaterialInput>
                                )
                        }
                        <div className="attr-card-type">{attr.value_type}</div>
                    </div>
                </div>
                <div className="attr-card-metadata">
                    <div className="attr-card-metadata-header">
                        <img src="images/icons/metadata-gray.png" alt="attrs-icon" />
                        <div className="attr-card-metadata-label">{`Meta attributes(${metaLength})`}</div>
                        <div
                            className="attr-card-metadata-arrow"
                            onClick={() => this.handleShowMetadata()}
                            onKeyPress={() => this.handleShowMetadata()}
                            role="button"
                            tabIndex="0"
                        >
                            <i className={`fa fa-angle-${showMetadata ? 'up' : 'down'}`} aria-hidden="true" />
                        </div>
                    </div>
                    <div className="attr-card-metadata-body">
                        {
                            showMetadata && Object.prototype.hasOwnProperty.call(attr, 'metadata')
                                ? (attr.metadata.map(meta => (
                                    <div key={meta.id} className="attr-card-input-wrapper">
                                        <MaterialInput
                                            className="attr-card-input"
                                            name={meta.label}
                                            maxLength={40}
                                            value={meta.static_value}
                                            onChange={e => this.handleChangeMetadata(e)}
                                        >
                                            {meta.label}
                                        </MaterialInput>
                                        <div className="attr-card-type">{meta.value_type}</div>
                                    </div>
                                )))
                                : <div />
                        }
                    </div>
                </div>
                <div className="divider" />
            </div>
        );
    }
}

export default AttrCard;
