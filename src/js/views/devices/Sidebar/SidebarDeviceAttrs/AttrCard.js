import React, { PureComponent } from 'react';
import MaterialInput from 'Components/MaterialInput';
import { withNamespaces } from 'react-i18next';
import * as i18next from 'i18next';
import PropTypes from 'prop-types';

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
        const {
            handleChangeAttr, handleChangeMetadata, errors, t,
        } = this.props;
        const metaLength = metadata !== undefined
            ? metadata.length
            : 0;
        const errorMessage = errors ? errors.message : '';
        const valid = errors ? Object.keys(errors).length === 0 : true;
        const isDynamic = attr.type === 'dynamic';
        if (Object.keys(attr).length === 0) return <div />;
        return (
            <div className="attr-card">
                <div className="attr-card-header">
                    <img src="images/icons/data_attrs-gray.png" alt="attrs-icon" />
                    <div className="attr-card-input-wrapper" id={`label:${attr.label}`}>
                        {
                            isDynamic
                                ? (
                                    <div>
                                        {attr.label}
                                    </div>
                                )
                                : (
                                    <MaterialInput
                                        className="attr-card-input"
                                        name="name"
                                        title={`${attr.label}`}
                                        maxLength={40}
                                        value={attr.static_value}
                                        onChange={e => handleChangeAttr(e, attr.id)}
                                        valid={valid}
                                        error={errorMessage}
                                    >
                                        {i18next.exists(`options.config_type.values.${attr.label}`) ? t(`options.config_type.values.${attr.label}`) : `${attr.label}`}
                                    </MaterialInput>
                                )
                        }
                        <div className="attr-card-type">
                            {i18next.exists(`types.${(attr.value_type).replace(':', '_')}`) ? t(`types.${attr.value_type.replace(':', '_')}`) : attr.value_type}
                        </div>
                    </div>
                </div>
                {metaLength > 0 && (
                    <div className="attr-card-metadata">
                        <div className="attr-card-metadata-header">
                            <img src="images/icons/metadata-gray.png" alt="attrs-icon" />
                            <div
                                className="attr-card-metadata-label"
                            >
                                {`${t('devices:meta_attributes')} (${metaLength})`}
                            </div>
                            <div
                                className="attr-card-metadata-arrow"
                                onClick={() => this.handleShowMetadata()}
                                onKeyPress={() => this.handleShowMetadata()}
                                role="button"
                                tabIndex="0"
                                id={`meta_show:${attr.label}`}
                            >
                                <i
                                    className={`fa fa-angle-${showMetadata ? 'up' : 'down'}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        <div className="attr-card-metadata-body" id={`meta_data:${attr.label}`}>
                            {
                                showMetadata
                                    ? (metadata.map(meta => (
                                        <div key={meta.id} className="attr-card-input-wrapper">
                                            <MaterialInput
                                                className="attr-card-input"
                                                name={meta.label}
                                                maxLength={40}
                                                value={meta.static_value}
                                                onChange={e => handleChangeMetadata(e, attr.id)}
                                            >
                                                {`${meta.label} (${meta.type})`}
                                            </MaterialInput>
                                            <div className="attr-card-type">
                                                {i18next.exists(`types.${(meta.value_type).replace(':', '_')}`) ? t(`types.${meta.value_type.replace(':', '_')}`).replace('_', ':') : meta.value_type}
                                            </div>
                                        </div>
                                    )))
                                    : <div />
                            }
                        </div>
                    </div>
                )
                }
                <div className="divider" />
            </div>
        );
    }
}

AttrCard.propTypes = {
    attr: PropTypes.instanceOf(Object).isRequired,
    metadata: PropTypes.instanceOf(Object).isRequired,
    t: PropTypes.func.isRequired,
    handleChangeAttr: PropTypes.func.isRequired,
    handleChangeMetadata: PropTypes.func.isRequired,
    errors: PropTypes.func.isRequired,
};

export default withNamespaces()(AttrCard);
