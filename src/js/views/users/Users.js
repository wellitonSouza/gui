import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone'
import userManager from '../../comms/users/UserManager';

import alt from '../../alt';
import AltContainer from 'alt-container';
var UserStore = require('../../stores/UserStore');
var UserActions = require('../../actions/UserActions');

import { PageHeader } from "../../containers/full/PageHeader";
import Filter from "../utils/Filter";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


function SummaryItem(props) {
  const selectedClass = "lst-entry-users " + (props.isActive ? " active" : "");
  const name = ((props.user.name && (props.user.name.length > 0)) ? props.user.name : props.user.username);
  return (
    <div className={selectedClass}>
     <div className="col hovered">
       <div className="col s12">
          <div className="col s9 title2">{name}</div>
       </div>
       <div className="col s12 paddingTop10">
          <div className="col s3 openSans8">Service:</div>
          <div className="col s9 text-right subtitle"><label className="badge">{props.user.service}</label></div>
       </div>
     </div>
      <div className="col div-img">
        {/* TODO set a custom image */}
        <img src="images/user.png"/>
      </div>
      <div className="lst-entry-users-title col div-with-img">
        <div className="title">{name}</div>
        <div className="subtitle">{props.user.email}</div>
      </div>
    </div>
  )
}

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.handleDetail = this.handleDetail.bind(this);
  }

  handleDetail(e) {
    e.preventDefault();
    this.props.detailedUser(this.props.user);
  }

  render() {
    const active = (this.props.user.id == this.props.detail);
    return (
      <div className="col s12 no-padding clickable" id={this.props.user.id} onClick={this.handleDetail}>
          <SummaryItem user={this.props.user} isActive={active}/>
      </div>
    )
  }
}

class DetailItem extends Component {
  constructor(props) {
    super(props);

    this.handleEdit = this.handleEdit.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleDismiss(e) {
    e.preventDefault();
    this.props.clearSelection();
  }

  handleEdit(e) {
    e.preventDefault();
    this.props.editUser(this.props.user.id);
  }

  handleRemove(e) {
    e.preventDefault();
    this.props.deleteUser(this.props.user);
  }

  render() {
    return (
      <span>
        <div className="lst-user-detail" >
          <div className="lst-line col s12">
            <div className="col s3">
                <p><img className="photo_big" src="images/user.png"/></p>
            </div>
            <div className="lst-user-title col s6">
              <span>{this.props.user.name}</span>
              <p className="subTitle">ID:<b>{this.props.user.id}</b></p>
            </div>
            <div className="lst-title col s3">
              <div className="edit right inline-actions">
                <a className="btn-floating waves-red right" onClick={this.handleEdit}>
                  <i className="material-icons">mode_edit</i>
                </a>
                <a className="btn-floating waves-red right" onClick={this.handleRemove}>
                  <i className="fa fa-trash" />
                </a>
              </div>
            </div>
          </div>

          <div className="lst-user-line col s12">
            <span className="field">Name</span>
          </div>
          <div className="lst-user-line col s12">
            <span className='value'> {this.props.user.name} </span>
          </div>
          <div className="lst-user-line col s12">
            <span className="field">Email</span>
          </div>
          <div className="lst-user-line col s12 data">
            <span className='value'> {this.props.user.email} </span>
          </div>
          <div className="lst-user-line col s12">
            <span className="field">Login</span>
          </div>
          <div className="lst-user-line col s12 data">
            <span className='value'> {this.props.user.username} </span>
          </div>
          <div className="lst-user-line col s12">
            <span className="field">Service</span>
          </div>
          <div className="lst-user-line col s12 data">
            <span className='value'> {this.props.user.service} </span>
          </div>
        </div>
      </span>
    )
  }
}

const FormActions = alt.generateActions('set', 'update', 'reset');
class FStore {
  constructor() {
    this.user = {};
    this.bindListeners({
      set: FormActions.SET,
      update: FormActions.UPDATE
    });
    this.set(null);
  }

  set(user) {
    if (user === null || user === undefined) {
      this.user = {
        name: "",
        email: "",
        username: "",
        passwd: "",
        service: ""
      };
    } else {
      this.user = user;
    }
  }

  update(diff) {
    this.user[diff.f] = diff.v;
  }
}
var FormStore = alt.createStore(FStore, 'FormStore');

class UserForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AltContainer store={FormStore}>
        <UserFormImpl {...this.props} />
      </AltContainer>
    )
  }
}

class UserFormImpl extends Component {
  constructor(props) {
    super(props);
    this.saveUser = this.saveUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  saveUser(e) {
    e.preventDefault();
    this.props.save(this.props.user);
    // TODO dismiss/select created user
  }

  handleChange(e) {
    e.preventDefault();
    const f = e.target.name;
    const v = e.target.value;
    FormActions.update({f: f, v: v});
  }

  render() {
    return (
      <span>
        <form onSubmit={this.saveUser}>
          <div className="lst-line col s12">
              <div className="col s2">
                <p><img id="imgForm" src="images/user.png"/></p>
              </div>
              <div className="lst-user-title col s10">
                <span>{this.props.title}</span>
                <p className="subTitle"><b>Id:</b>{this.props.user.id}</p>
              </div>
          </div>


          <div className="lst-user-detail" >
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_Name">Name</label>
              <input id="fld_Name" type="text"
                     name="name" value={this.props.user.name}
                     key="name" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_Email">Email</label>
              <input id="fld_Email" type="text"
                     name="email" value={this.props.user.email}
                     key="email" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_login">Login</label>
              <input id="fld_login" type="text"
                     name="username" value={this.props.user.username}
                     key="username" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_password">Password</label>
              <input id="fld_password" type="password"
                     name="passwd" value={this.props.user.passwd}
                     key="passwd" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_service">Managed service</label>
              <input id="fld_service" type="text"
                     name="service" value={this.props.user.service}
                     key="service" onChange={this.handleChange} />
            </div>
          </div>

          <div className="col s6 buttons">
            <div className="pull-left">
              <a onClick={this.props.dismiss} className="waves-light btn-flat red">Cancel</a>
            </div>
          </div>
          <div className="col s6">
            <div className="pull-right">
              <button type="submit" className="waves-light btn-flat teal darken-4">Save</button>
            </div>
          </div>
        </form>
      </span>
    )
  }
}

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      detail: undefined,
      edit: undefined,
      create: undefined,
      current: 1,
      usersByPage: 6,
      listOfUser: undefined,
      listOfUserByPage: undefined,
      height: undefined
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.detailedUser = this.detailedUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.applyFiltering = this.applyFiltering.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.applyPagination = this.applyPagination.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.isFirstPage = this.isFirstPage.bind(this);
    this.isLastPage = this.isLastPage.bind(this);

    this.newUser = this.newUser.bind(this);
  }

  handleFieldChange(e) {
    let state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  clearSelection() {
    let temp = this.state;
    temp.edit = undefined;
    temp.detail = undefined;
    temp.create = undefined;
    this.setState(temp);
    return true;
  }

  detailedUser(user) {
    let temp = this.state;
    temp.detail = user.id;
    FormActions.set(user);
    temp.user = user;
    temp.create = undefined;
    temp.edit = undefined;
    this.setState(temp);
    return true;
  }

  editUser(id) {
    if (this.state.detail === id) {
      let temp = this.state;
      temp.edit = id;
      temp.create = undefined;
      this.setState(temp);
      return true;
    }
    return false;
  }

  updateUser(user) {
      UserActions.triggerUpdate(user);
  }

  deleteUser(user) {
    UserActions.triggerRemoval(user);
    const state = {detail: undefined, create: undefined};
    this.setState(state);
  }

  handleCreate() {
    FormActions.set(null);
    this.clearSelection();
    let temp = this.state;
    temp.create = true;
    this.setState(temp);
    return true;
  }

  applyFiltering(list) {
    // TODO make filtering work for users
    return list;
    const filter = this.state.filter;
    const idFilter = filter.match(/id:\W*([-a-fA-F0-9]+)\W?/);
    return this.props.users.filter(function(e) {
      let result = false;
      if (idFilter && idFilter[1]) {
        result = result || e.id.toUpperCase().includes(idFilter[1].toUpperCase());
      }

      return result || e.name.toUpperCase().includes(filter.toUpperCase());
    });
  }

  handleSearchChange(event) {
    const filter = event.target.value;
    let state = this.state;
    state.filter = filter;
    state.detail = undefined;
    this.setState(state);
  }

  applyPagination() {
    let state = this.state;
    const listPaginate = [];
    let count = 0;
    let initIndex = (this.state.current-1) * this.state.usersByPage;
    let finalIndex = this.state.current * this.state.usersByPage;
    for (let i = initIndex; i < finalIndex; i++) {
      if (this.state.listOfUser[i] != undefined) {
        listPaginate[count] = this.state.listOfUser[i];
      }
      count++;
    }
    this.state.listOfUserByPage = listPaginate;
  }

  isFirstPage() {
    return this.state.current == 1;
  }

  isLastPage() {
    return this.state.listOfUser.length <= ((this.state.current) * this.state.usersByPage);
  }


  prevPage(list) {
    let state = this.state;
    if (!this.isFirstPage()) {
      state.current--;
      this.applyPagination();
    }
    this.setState(state);
  }

  nextPage() {
    let state = this.state;
      if (!this.isLastPage()) {
        state.current++;
        this.applyPagination();
        this.setState(state);
      }
  }

  componentDidMount() {
    // TODO: use this later on to set the number of entries to be presented in each page
    // const height = document.getElementsByClassName('userCanvas')[0].clientHeight;
    // console.log("got height: " + height);
  }

  newUser(user) {
    UserActions.addUser(user);
    const state = {detail: undefined, create: undefined};
    this.setState(state);
  }

  render() {

    this.state.listOfUser = this.applyFiltering(this.props.users);
    this.applyPagination();
    let displayed = this.state.usersByPage;
    if (this.state.listOfUser.length < displayed)
      displayed = this.state.listOfUser.length;

    let detailAreaStatus = "";
    if (this.state.create || this.state.edit) detailAreaStatus = " create";
    if (this.state.detail) detailAreaStatus = " selected";
    const prevPageClass = (this.isFirstPage() ? " inactive" : "");
    const nextPageClass = (this.isLastPage() ? " inactive" : "");


    return (
      <span>

        {/* TODO promote this */}
        <div className="row z-depth-2 userSubHeader p0" id="inner-header">
          <div className="col s4 m4 main-title">List of Users</div>

          <div className="col s2 m2 header-card-info">
            <div className="title"># Users</div>
            <div className="subtitle">{this.state.listOfUser.length}</div>
          </div>

          <div className="col s4 header-card-info"></div>

          <div className="col s6 m2 button">
            <a id="btnNewUser" className="waves-effect waves-light btn-flat" onClick={this.handleCreate}>New User</a>
          </div>
        </div>

        <div className={"row userCanvas z-depth-2" + detailAreaStatus}>
        { this.state.listOfUserByPage.length > 0 ? (
              <div className="col s4 no-padding" id="user-list">
                { this.state.listOfUserByPage.map((user) =>
                    <ListItem user={user}
                              key={user.id}
                              detail={this.state.detail}
                              detailedUser={this.detailedUser}/>
                )}
                <div className="col s4 userCanvasFooter">
                  <div id="labelShowing" className="col s12 m6">Showing {this.state.listOfUserByPage.length} of {this.state.listOfUser.length}</div>
                  <div id="prevPageId" className="col s6 m3 clickable">
                    <a className={prevPageClass} onClick={this.prevPage}><i className="fa fa-chevron-left paddingRight10"></i>PREV</a>
                  </div>
                  <div id="nextPageId" className="col s6 m3 clickable">
                    <a className={nextPageClass} onClick={this.nextPage}>NEXT<i className="fa fa-chevron-right paddingLeft10"></i></a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col s4 background-info">
                <span className="background-info">No configured users</span>
              </div>
            )
          }

          <div className={"col s8" + detailAreaStatus} id="detail-area">
            {this.state.create != undefined ? (
                <UserForm dismiss={this.clearSelection}
                          save={this.newUser}
                          title="New User" />
            ) : this.state.edit != undefined ? (
                <UserForm dismiss={this.clearSelection}
                          save={UserActions.triggerUpdate}
                          title={this.state.user.name} />
                ) : (
                this.state.detail != undefined ? (
                  <DetailItem user={this.state.user}
                              editUser={this.editUser}
                              clearSelection={this.clearSelection}
                              deleteUser={this.deleteUser}/>
                ) : (
                  <div className="initialUserMessage">
                    <p>Select a user</p>
                    <p>to see its details</p>
                  </div>
                ))}
          </div>

        </div>
      </span>
    )
  }
}

class Users extends Component {

  constructor(props) {
    super(props);

    this.state = UserStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    UserStore.listen(this.onChange);
    UserActions.fetchUsers.defer();
  }

  componentWillUnmount() {
    UserStore.unlisten(this.onChange);
  }

  onChange(newState) {
    this.setState(UserStore.getState());
    console.log("users container component - onChange", this.state);
  }

  filterChange(newFilter) {
    console.log("about to change filter: " + newFilter);
  }

  render() {
    return (
      <span id="userMain">
        <ReactCSSTransitionGroup
            transitionName="first"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500} >
          <PageHeader title="Access control list" subtitle="Users">
            <Filter onChange={this.filterChange} />
          </PageHeader>
          <UserList users={this.state.users} />
        </ReactCSSTransitionGroup>
      </span>
    );
  }
}

export default Users;
