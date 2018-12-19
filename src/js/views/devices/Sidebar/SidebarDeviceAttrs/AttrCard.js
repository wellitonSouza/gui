import React, { PureComponent } from 'react';
import MaterialInput from 'Components/MaterialInput';

class AttrCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showMetadata: false,
            attr: {},
            metadata: [],
        };

        this.handleShowMetadata = this.handleShowMetadata.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.metadata !== prevState.metadata) {
            return {
                ...prevState,
                metadata: nextProps.metadata,
            };
        }
        if (nextProps.attr !== prevState.attr) {
            return {
                ...prevState,
                attr: nextProps.attr,
            };
        }
        return null;
    }


    componentDidMount() {
        const { attr, metadata } = this.props;
        this.setState({
            attr,
            metadata,
        });
    }

    handleShowMetadata() {
        this.setState(prevState => ({
            showMetadata: !prevState.showMetadata,
        }));
    }

    render() {
        const { showMetadata, attr, metadata } = this.state;
        const { handleChangeAttr, handleChangeMetadata } = this.props;
        const metaLength = metadata !== undefined
            ? metadata.length
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
                                        onChange={e => handleChangeAttr(e, attr.id)}
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
                            showMetadata && metadata !== undefined
                                ? (metadata.map(meta => (
                                    <div key={meta.id} className="attr-card-input-wrapper">
                                        <MaterialInput
                                            className="attr-card-input"
                                            name={meta.label}
                                            maxLength={40}
                                            value={meta.static_value}
                                            onChange={e => handleChangeMetadata(e, attr.id)}
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
