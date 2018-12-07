import React, { PureComponent } from 'react';
import MaterialInput from 'Components/MaterialInput';

class AttrCard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showMetadata: false,
        };

        this.handleShowMetadata = this.handleShowMetadata.bind(this);
    }

    handleShowMetadata() {
        this.setState(prevState => ({
            showMetadata: !prevState.showMetadata,
        }));
    }

    render() {
        const { showMetadata } = this.state;
        const { attr } = this.props;
        console.log('attr', attr);
        return (
            <div className="attr-card">
                <div className="attr-card-header">
                    <img src="images/icons/data_attrs-gray.png" alt="attrs-icon" />
                    <div className="attr-card-input-wrapper">
                        <MaterialInput
                            className="attr-card-input"
                            name="name"
                            maxLength={40}
                            value={attr.static_value}
                        >
                            {attr.label}
                        </MaterialInput>
                        <div className="attr-card-type">{'string'}</div>
                    </div>
                </div>
                <div className="attr-card-metadata">
                    <div className="attr-card-metadata-header">
                        <img src="images/icons/metadata-gray.png" alt="attrs-icon" />
                        <div className="attr-card-metadata-label">{'Meta attributes(3)'}</div>
                        <div
                            className="attr-card-metadata-arrow"
                            onClick={() => this.handleShowMetadata()}
                            onKeyPress={() => this.handleShowMetadata()}
                            role="button"
                            tabIndex="0"
                        >
                            <i className="fa fa-angle-down" aria-hidden="true" />
                        </div>
                    </div>
                    <div className="attr-card-metadata-body">
                        {
                            showMetadata
                                ? (
                                    <div className="attr-card-input-wrapper">
                                        <MaterialInput
                                            className="attr-card-input"
                                            name="name"
                                            maxLength={40}
                                        >
                                            {'Serial'}
                                        </MaterialInput>
                                        <div className="attr-card-type">{'string'}</div>
                                    </div>
                                )
                                : <div />
                        }
                    </div>
                </div>
                <div className="divider" />
            </div>
        );
    }
};

export default AttrCard;
