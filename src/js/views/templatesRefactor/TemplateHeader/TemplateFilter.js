import React, { Component } from 'react';

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

    updateQuery(element) {
        const qy = this.state.query;
        qy[element.label] = element.value;
        if (element.value.trim() == '') delete qy[element.label];
        this.setState({ query: qy });
    }

    doSearch() {
        this.props.ops.whenUpdateFilter(this.state.query);
    }

    handleChange(event) {
        event.preventDefault();
        const f = event.target.name;
        const v = event.target.value;
        this.updateQuery({ label: f, value: v });
    }

    componentDidMount() {

    }

    render() {
        const Fields = this.props.fields;

        return (
            <div>
            filterBar
            </div>
        );
    }
}

export default TemplateFilter;
