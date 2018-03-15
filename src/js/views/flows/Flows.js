import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import AltContainer from 'alt-container';

import FlowStore from '../../stores/FlowStore';
import FlowActions from '../../actions/FlowActions';

import {PageHeader, NewPageHeader} from "../../containers/full/PageHeader";
import util from "../../comms/util/util";

function SummaryItem(props) {
  return (
      <div className={"card-size lst-entry-wrapper z-depth-2 fullHeight"}>
          <div className="lst-entry-title col s12">
              <img className="title-icon" src={"images/white-chip.png"}/>
              <div className="title-text">
                  <span className="text"> {props.flow.name} </span>
              </div>
          </div>
          <div className="attr-list">
              <div className={"attr-area light-background"}>
                  <div className="attr-row">
                      <div className="icon">
                          <img src={"images/tag.png"}/>
                      </div>
                      <div className={"attr-content"}>
                          <input type="text" value={props.flow.flow.length - 1} disabled={true}/>
                          <span>Nodes</span>
                      </div>
                      <div className="center-text-parent material-btn right-side">
                      </div>
                  </div>
                  <div className="attr-row">
                      <div className="icon">
                          <img src={"images/update.png"}/>
                      </div>
                      <div className={"attr-content"}>
                          <input type="text" value={util.printTime(props.flow.updated / 1000)} disabled={true}/>
                          <span>Last update</span>
                      </div>
                      <div className="center-text-parent material-btn right-side">
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

class ListRender extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const flowList = this.props.flows;
    if (Object.keys(flowList).length > 0) {
      return (
        <div className="row">
          <div className="col s12  lst-wrapper">
            { Object.keys(flowList).map((flowid) =>
              <Link to={"/flows/id/" + flowid} key={flowid} >
                <div className="lst-entry col s12 m6 l4 mt30">
                  <SummaryItem flow={flowList[flowid]} />
                </div>
              </Link>
            )}
          </div>
        </div>
      )
    } else {
      return  (
        <div className="row full-height relative">
          <div className="background-info valign-wrapper full-height">
            <span className="horizontal-center">No configured flows</span>
          </div>
        </div>
      )
    }
  }
}

class FlowList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
    };

    this.handleViewChange = this.handleViewChange.bind(this);
    this.applyFiltering = this.applyFiltering.bind(this);
    this.detailedTemplate = this.detailedTemplate.bind(this);
    this.editTemplate = this.editTemplate.bind(this);
  }

  handleViewChange(event) {
    this.setState({isDisplayList: ! this.state.isDisplayList})
  }

  detailedTemplate(id) {
    let temp = this.state;

    if (this.state.detail && this.state.edit) {
      if (id === undefined) {
        temp.edit = undefined;
      }
    }

    temp.detail = id;
    this.setState(temp);
    return true;
  }

  editTemplate(id) {
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      this.setState(temp);
      return true;
    }

    return false;
  }

  // handleSearchChange(event) {
  //   const filter = event.target.value;
  //   let state = this.state;
  //   state.filter = filter;
  //   state.detail = undefined;
  //   this.setState(state);
  // }

  applyFiltering(flowList) {
    return flowList;

    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);

    return flowList.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.label.toUpperCase().includes(filter.toUpperCase());
    });
  }

  render() {
    const filteredList = this.applyFiltering(this.props.flows);

    return (
      <div className="col m10 s12 offset-m1 full-height relative" >

        <ListRender flows={filteredList}
                    detail={this.state.detail}
                    detailedTemplate={this.detailedTemplate}
                    edit={this.state.edit}
                    editTemplate={this.editTemplate} />

        {/* <!-- footer --> */}
        <div className="col s12"></div>
        <div className="col s12">&nbsp;</div>
      </div>
    )
  }
}

class Flows extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    FlowActions.fetch.defer();
  }

  render() {
    return (
      <ReactCSSTransitionGroup
          transitionName="first"
          transitionAppear={true} transitionAppearTimeout={100}
          transitionEnterTimeout={100} transitionLeaveTimeout={100} >
        <NewPageHeader title="data flows" subtitle="" icon="flow">
          <Link to="/flows/new" className="new-btn-flat red waves-effect waves-light " title="Create a new data flow">
            New Flow <i className="fa fa-plus"/>
          </Link>
        </NewPageHeader>

        <AltContainer store={FlowStore}>
          <ListRender />
        </AltContainer>
      </ReactCSSTransitionGroup>
    );
  }
}

export { Flows };
