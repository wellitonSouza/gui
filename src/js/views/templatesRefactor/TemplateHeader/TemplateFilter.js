import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TemplateFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: { sortBy: 'label' },
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    componentDidMount() {

    }

    updateQuery(element) {
        const { query } = this.state;
        query[element.label] = element.value;
        if (element.value.trim() === '') delete query[element.label];
        this.setState({ query });
    }

    doSearch() {
        const { ops } = this.props;
        const { query } = this.state;
        ops.whenUpdateFilter(query);
    }

    handleChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.updateQuery({ label: name, value });
    }


    render() {
        return (
            <div>
                filterBar
            </div>
        );
    }
}

TemplateFilter.propTypes = {
    ops: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default TemplateFilter;
