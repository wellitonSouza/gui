/* eslint react/prop-types: 0 */
/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import { DojotBtnCircle } from '../../components/DojotButton';
import MaterialSelect from '../../components/MaterialSelect';

class GenericOperations {
    setDefaultPageNumber() {
        this.paginationParams.pageNum = 1;
    }

    setDefaultPaginationParams() {
        this.paginationParams = {
            pageSize: 6,
            pageNum: 1,
        };
    }

    hasFilter() {
        if (Object.keys(this.filterParams).length > 1) { // sortBy attribute
            return true;
        }
        return false;
    }

    getCurrentQuery() {
        return this.filterParams;
    }
}

const FilterLabel = ({ ops }) => {
    if (ops.hasFilter()) {
        return (
            <div className="col s2 p0 filter-information">
                <i className="fa fa-info-circle " />
                {' '}
                Filtering
            </div>
        );
    }
    return <div className="col s2 p0 filter-information" />;
};


class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 6,
            pageNum: 1,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.changeNelements = this.changeNelements.bind(this);
    }

    handlePageClick(data) {
        const state = { ...this.state };
        const { ops } = this.props;
        state.pageNum = data.selected + 1;
        this.setState(state);
        ops.whenUpdatePagination(state);
    }

    changeNelements(event) {
        const state = { ...this.state };
        const { ops } = this.props;
        state.pageSize = event.target.value;
        state.pageNum = 1; // we need restart to the first page
        this.setState(state);
        ops.whenUpdatePagination(state);
    }

    render() {
        // console.log('Render Pagination Component ', this.props);
        const { pagination, show_pagination: showPagination } = this.props;
        const { elements_page: elementsPage } = this.state;
        if (!pagination || !showPagination || !pagination.total) {
            return <div className="col s7 p0" />;
        }

        const pageCount = pagination.total;
        const currentPage = pagination.page - 1;

        return (
            <div className="col s7 p0">
                <div className="pagination_div">
                    <ReactPaginate previousLabel="previous" nextLabel="next" pageCount={pageCount} marginPagesDisplayed={1} pageRangeDisplayed={3} forcePage={currentPage} onPageChange={this.handlePageClick} containerClassName="pagination" subContainerClassName="pages pagination" activeClassName="active" />
                </div>
                <div className="elements_page_div">
                    <MaterialSelect new_style label="# per page" value={elementsPage} onChange={this.changeNelements}>
                        <option key="six" value="6">
                6
                        </option>
                        <option key="twelve" value="12">
                12
                        </option>
                        <option key="eighteen" value="18">
                18
                        </option>
                        <option key="thirtysix" value="36">
                36
                        </option>
                        <option key="sixtyfour" value="64">
                64
                        </option>
                    </MaterialSelect>
                </div>
            </div>
        );
    }
}

class NewPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 6,
            pageNum: 1,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.changeNelements = this.changeNelements.bind(this);
    }

    handlePageClick(data) {
        const state = { ...this.state };
        const { ops } = this.props;
        state.pageNum = data.selected + 1;
        this.setState(state);
        ops.whenUpdatePagination(state);
    }

    changeNelements(event) {
        const state = { ...this.state };
        const { ops } = this.props;
        state.pageSize = event.target.value;
        state.pageNum = 1; // we need restart to the first page
        this.setState(state);
        ops.whenUpdatePagination(state);
    }

    render() {
        const { pagination, showPagination } = this.props;
        const { elements_page: elementsPage } = this.state;

        if (!pagination || !showPagination || !pagination.total) {
            return <div className="pagination-wrapper" />;
        }

        const pageCount = pagination.total;
        const currentPage = pagination.page - 1;

        return (
            <div className="pagination-wrapper">
                <div className="elements_page_div">
                    <MaterialSelect new_style label="# per page" value={elementsPage} onChange={this.changeNelements}>
                        <option key="six" value="6">6</option>
                        <option key="twelve" value="12">12</option>
                        <option key="eighteen" value="18">18</option>
                        <option key="thirtysix" value="36">36</option>
                        <option key="sixtyfour" value="64">64</option>
                    </MaterialSelect>
                </div>
                <div className="pagination_div">
                    <ReactPaginate previousLabel="previous" nextLabel="next" pageCount={pageCount} marginPagesDisplayed={1} pageRangeDisplayed={3} forcePage={currentPage} onPageChange={this.handlePageClick} containerClassName="pagination" subContainerClassName="pages pagination" activeClassName="active" />
                </div>
            </div>
        );
    }
}


class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    componentDidMount() {
        const { ops } = this.props;
        if (ops.hasFilter()) {
            const qry = ops.getCurrentQuery();
            // console.log('Getting current query: ', qry);
            this.setState({ query: qry });
        }
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
        // console.log('Render Filter Component ', this.props, this.state);
        const { fields: Fields, showPainel, metaData } = this.props;
        const { query } = this.state;
        return (
            <div className={`row z-depth-2 templatesSubHeader ${showPainel ? 'show-dy' : 'hide-dy'}`} id="inner-header">
                <div className="col s3 m3 main-title">
                    $
                    {`Filtering ${metaData.alias}(s)`}
                </div>
                <div className="col s6 m6">
                    <Fields fields={query} onChange={this.handleChange} />
                </div>
                <div className="col s1 m1 pt10">
                    <DojotBtnCircle click={this.doSearch} icon="fa fa-search" />
                </div>
            </div>
        );
    }
}

class SimpleFilter extends Component {
    constructor(props) {
        super(props);

        this.state = { filter: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { onChange } = this.props;
        this.setState({ filter: event.target.value });
        onChange(event.target.value);
    }

    render() {
        const { filter } = this.state;
        return (
            <div className="filter-wrapper relative-size">
                <form>
                    {/* filter selection  */}
                    <div className="input-field">
                        {/* <i className="prefix fa fa-search"></i> */}
                        <label htmlFor="deviceFiltering">
                            Filter
                            <input id="deviceFiltering" type="text" onChange={this.handleChange} value={filter} />
                        </label>
                    </div>
                </form>
            </div>
        );
    }
}

// export default Filter;
export {
    SimpleFilter, Filter, Pagination, FilterLabel, GenericOperations, NewPagination,
};
