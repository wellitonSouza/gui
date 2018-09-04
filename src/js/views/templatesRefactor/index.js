/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AltContainer from 'alt-container';

import TemplateStore from '../../stores/TemplateStore';
import TemplateActions from '../../actions/TemplateActions';
import TemplateHeader from './TemplateHeader';
import TemplateOperations from './TemplateOperations';

class TemplatesRefactor extends Component {
    constructor(props) {
        super(props);
        this.state = { hasNewTemplate: false };

        this.tempOpex = new TemplateOperations();
        this.toggleSearchBar = this.toggleSearchBar.bind(this);
        this.addTemplate = this.addTemplate.bind(this);
    }

    componentDidMount() {
        this.tempOpex._fetch();
        this.setState({ hasNewTemplate: false });
    }

    toggleSearchBar() {
        const { showFilter: last } = this.state;
        this.setState({ showFilter: !last });
    }

    addTemplate() {
        const { hasNewTemplate } = this.state;
        if (hasNewTemplate) return;
        const template = {
            id: 'new_template',
            label: '',
            data_attrs: [],
            config_attrs: [],
            attrs: [],
            isNewTemplate: true,
        };
        TemplateActions.insertTemplate(template);
        this.setState({ hasNewTemplate: true });
    }

    enableNewTemplate() {
        this.setState({ hasNewTemplate: false });
    }

    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="first"
                transitionAppear
                transitionAppearTimeout={100}
                transitionEnterTimeout={100}
                transitionLeaveTimeout={100}
            >
                <div className="full-device-area">
                    <AltContainer store={TemplateStore}>
                        <TemplateHeader
                            toggleSearchBar={this.toggleSearchBar}
                            addTemplate={this.addTemplate}
                            tempOpex={this.tempOpex}
                        />
                    </AltContainer>
                </div>

            </ReactCSSTransitionGroup>
        );
    }
}

export default TemplatesRefactor;
