/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { withNamespaces } from 'react-i18next';

class ListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            template: this.props.template,
            fw_version_used: null,
        };
    }

    componentWillMount() {
        const { template } = this.state;
        for (const k in template.config_attrs) {
            if (template.config_attrs[k].type == 'actuator') {
                template.data_attrs.push(template.config_attrs[k]);
                template.config_attrs.splice(k, 1);
            }
        }
        this.setState({ template });
    }

    componentDidMount() {
        const { template } = this.state;
        if (!template.isNewTemplate) {
            let fwVersion = null;
            const attr = template.config_attrs.filter(
                elem => elem.type === 'fw_version',
            )[0];
            if (attr) fwVersion = attr.static_value;
            this.setState({ fw_version_used: fwVersion });
        }
    }

    render() {
        const { template } = this.state;
        if (this.state.fw_version_used) {
            fw_version_used = this.state.fw_version_used;
        }

        const attrs = template.data_attrs.length + template.config_attrs.length;

        const {t}=this.props;

        return (
            <Fragment>
                <div
                    className={`mg20px fl ${template.isNewTemplate ? 'flex-order-1' : 'flex-order-2'}`}
                    onClick={() => this.props.selectTemplate(template)} title={template.label}
                    >
                    <div
                        className="template-card template card-size lst-entry-wrapper z-depth-2 mg0px height-auto suppressed card-hover"
                        id={this.props.id}
                    >
                        <div className="lst-entry-title bg-gradient-ciano-blue col s12">
                            <img
                                className="title-icon template"
                                src="images/big-icons/template.png"
                                alt=""
                            />
                            <div className="title-text truncate">
                                <span>
                                    {template.label}
                                </span>
                            </div>
                        </div>
                        <div className="lst-entry-body">
                            <div className="icon-area center-text-parent">
                                <span className="center-text-child">{attrs}</span>
                            </div>
                            <div className="text-area center-text-parent">
                                <span className="middle-text-child">{t('text.properties')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withNamespaces()(ListItem);
