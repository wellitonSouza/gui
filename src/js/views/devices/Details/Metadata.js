import React, {Component} from 'react';
import * as i18next from 'i18next';

class Metadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

        this.showMetadata = this.showMetadata.bind(this);
    }

    showMetadata() {
        this.setState({open: !this.state.open});
    }

    render() {
        const {attr: {metadata}} = this.props;
        const {open} = this.state;
        return (
            <div className="metadata-wrapper">
                <div className="button" onClick={this.showMetadata}>
                    {`Meta Attributes (${metadata.length})`}
                    <i className={`fa ${open ? 'fa-angle-up' : 'fa-angle-down'}`}/>
                </div>
                {metadata.map(item => (
                    open && (
                        <div className="display-flex-column flex-1">
                            <div
                                className="name-value truncate"
                                title={`${item.label} (${item.type})`}
                            >
                                {`${item.label} (${item.type})`}
                            </div>
                            <div className="display-flex-no-wrap space-between">
                                <div
                                    className="value-value truncate"
                                    title={item.static_value}
                                >
                                    {item.static_value}
                                </div>
                                <div
                                    className="value-label "
                                    title={item.value_type}
                                >
                                    {i18next.exists(`types.${item.value_type}`) ? i18next.t(`types.${item.value_type}`) : item.value_type}
                                </div>

                            </div>
                        </div>
                    )
                ))}

            </div>
        );
    }
}

export default Metadata;
