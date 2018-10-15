import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import TemplateStore from 'Stores/TemplateStore';
import { NewPageHeader } from 'Containers/full/PageHeader';
import OperationsHeader from './OperationsHeader';
import { Filter, Pagination, FilterLabel } from '../utils/Manipulation';
import TemplateList from './TemplateList/index';
import TemplateOperations from './TemplateOperations';

const FilterFields = ({ fields, onChange }) => (
    <div className="col s12 m12">
        <input
            id="fld_name"
            type="text"
            className="form-control form-control-lg"
            placeholder="Label"
            name="label"
            value={fields.label}
            onChange={onChange}
        />
    </div>
);

FilterFields.propTypes = {
    fields: PropTypes.shape({
        sortBy: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
};

class Templates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showFilter: false,
        };
        this.temp_opex = new TemplateOperations();
        this.toggleSearchBar = this.toggleSearchBar.bind(this);
    }

    componentDidMount() {
        this.temp_opex._fetch();
    }

    toggleSearchBar() {
        const { showFilter } = this.state;
        this.setState({ showFilter: !showFilter });
    }

    render() {
        const { showFilter } = this.state;
        return (
            <div className="full-device-area">
                <AltContainer store={TemplateStore}>
                    <NewPageHeader title="Templates" subtitle="Templates" icon="template">
                        <FilterLabel ops={this.temp_opex} text="Filtering Templates" />
                        <Pagination show_pagination ops={this.temp_opex} />
                        <OperationsHeader toggleSearchBar={this.toggleSearchBar} />
                    </NewPageHeader>
                    <Filter
                        showPainel={showFilter}
                        metaData={{ alias: 'template' }}
                        ops={this.temp_opex}
                        fields={FilterFields}
                    />
                    <TemplateList temp_opex={this.temp_opex} />
                </AltContainer>
            </div>
        );
    }
}


export default Templates;
