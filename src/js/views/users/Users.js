import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone'
import userManager from '../../comms/users/UserManager';

var UserStore = require('../../stores/UserStore');
var UserActions = require('../../actions/UserActions');

import PageHeader from "../../containers/full/PageHeader";
import Filter from "../utils/Filter";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function SummaryItem(props) {
  const selectedClass = "lst-entry-users " + (props.isActive ? " active" : "");
  const name = ((props.user.name && (props.user.name.length > 0)) ? props.user.name : props.user.username);
  return (
    <div className={selectedClass}>
      <div className="col s3">
        {/* TODO set a custom image */}
        <img src="images/user.png"/>
      </div>
      <div className="lst-entry-users-title col s9">
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
    const active = (this.props.username == this.props.detail);

    return (
      <div className="col s12 no-padding" id={this.props.user.id} onClick={this.handleDetail}>
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

  componentDidMount() {

  }

  componentWillUnmount() {

  }

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
            <div className="col s2">
              <p><img src="images/user.png"/></p>
            </div>
            <div className="lst-user-title col s7">
              <span>{this.props.user.name}</span>
              <p className="subTitle"><b>Id:</b> {this.props.user.id}</p>
            </div>
            <div className="lst-title col s3">
              <div className="edit right inline-actions">
                <a className="btn-floating waves-green right" onClick={this.handleDismiss}>
                  <i className="fa fa-times"></i>
                </a>
                <a className="btn-floating waves-red right" onClick={this.handleEdit}>
                  <i className="material-icons">mode_edit</i>
                </a>
                <a className="btn-floating waves-light red" onClick={this.handleRemove}>
                  <i className="material-icons">delete</i>
                </a>
              </div>
            </div>
          </div>
          <div className="lst-user-line col s12">
            <p className="subTitle">Last Name</p>
          </div>
          <div className="lst-user-line col s12">
            {this.props.user.lastName}
          </div>
          <div className="lst-user-line col s12">
            <p className="subTitle">Email</p>
          </div>
          <div className="lst-user-line col s12 data">
            {this.props.user.email}
          </div>
          <div className="lst-user-line col s12">
            <p className="subTitle">Login</p>
          </div>
          <div className="lst-user-line col s12 data">
            {this.props.user.login}
          </div>
          <div className="lst-user-line col s12">
            <p className="subTitle">Service</p>
          </div>
          <div className="lst-user-line col s12 data">
            {this.props.user.service}
          </div>
        </div>
      </span>
    )
  }
}

class EditItem extends Component {
  constructor (props) {
    super(props);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    let callback = this.props.handleFieldChange.bind(this);
    Materialize.updateTextFields();
  }

  handleDismiss(e) {
    e.preventDefault();
    this.props.clearSelection();
  }

  handleEdit(e) {
    e.preventDefault();
    this.props.updateUser(this.props.user);
  }

  render() {
    return (
      <form>
        <div className="lst-user-detail" >
          <div className="lst-line col s12">
            <div className="col s2">
              <p><img src="images/user.png"/></p>
            </div>
            <div className="lst-user-title col s10">
              <span>{this.props.user.name}</span>
              <p className="subTitle"><b>Id:</b> {this.props.user.id}</p>
            </div>
          </div>
          <div className="lst-line col s12">
            &nbsp;
          </div>
          <div className="lst-user-line col s12 input-field">
            <label htmlFor="fld_lastName">Name</label>
            <input id="fld_Name" type="text"
                   name="Name" value={this.props.user.name}
                   key="Name" onChange={this.props.user.name} />
          </div>
          <div className="lst-user-line col s12 input-field">
            <label htmlFor="fld_lastName">Last Name</label>
            <input id="fld_lastName" type="text"
                   name="lastName" value={this.props.user.lastName}
                   key="lastName" onChange={this.props.user.lastName} />
          </div>
          <div className="lst-user-line col s12 input-field">
            <label htmlFor="fld_lastName">Email</label>
            <input id="fld_Email" type="text"
                   name="email" value={this.props.user.email}
                   key="email" onChange={this.props.user.email} />
          </div>
          <div className="lst-user-line col s12 input-field">
            <label htmlFor="fld_login">Login</label>
            <input id="fld_login" type="text"
                   name="login" value={this.props.user.login}
                   key="login" onChange={this.props.user.login} />
          </div>
          <div className="lst-user-line col s12 input-field">
            <label htmlFor="fld_password">Password</label>
            <input id="fld_password" type="password"
                   name="password" value={this.props.user.password}
                   key="password" onChange={this.props.user.password} />
          </div>
          <div className="lst-user-line col s12 input-field">
            <label htmlFor="fld_service">Service</label>
            <input id="fld_service" type="text"
                   name="service" value={this.props.user.service}
                   key="service" onChange={this.props.user.service} />
          </div>
          <div className="col s6 buttons">
            <div className="pull-left">
              <a onClick={this.handleDismiss}
                 className="waves-light btn red">Cancel</a>
            </div>
          </div>
          <div className="col s6">
            <div className="pull-right">
              <a onClick={this.handleEdit}
                 className="waves-light btn teal darken-4">Save</a>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      username: "",
      passwd: "",
      service: ""
    }

    // this.handleDismiss = this.handleDismiss.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  // handleDismiss(e) {
  //   e.preventDefault();
  //   this.props.clearSelection();
  // }

  saveUser(e) {
    console.log("About to save user");
    e.preventDefault();
    this.props.save(this.state);
    // TODO dismiss/select created user
  }

  handleChange(e) {
    const target = e.target;
    let updated = this.state;
    updated[target.name] = target.value;
    this.setState(updated);
  }

  render() {
    return (
      <span>
        <div className="lst-line col s12">
          <div className="col s2">
            <p><img src="images/user.png"/></p>
          </div>
          <div className="lst-user-title col s10">
            <span>{this.props.title}</span>
          </div>
        </div>

        <form onSubmit={this.saveUser}>
          <div className="lst-user-detail" >
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_lastName">Name</label>
              <input id="fld_Name" type="text"
                     name="name" value={this.state.name}
                     key="name" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_lastName">Email</label>
              <input id="fld_Email" type="text"
                     name="email" value={this.state.email}
                     key="email" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_login">Login</label>
              <input id="fld_login" type="text"
                     name="username" value={this.state.username}
                     key="username" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_password">Password</label>
              <input id="fld_password" type="password"
                     name="passwd" value={this.state.passwd}
                     key="passwd" onChange={this.handleChange} />
            </div>
            <div className="lst-user-line col s12 input-field">
              <label htmlFor="fld_service">Managed service</label>
              <input id="fld_service" type="text"
                     name="service" value={this.state.service}
                     key="service" onChange={this.handleChange} />
            </div>
          </div>

          <div className="col s6 buttons">
            <div className="pull-left">
              <a onClick={this.props.dismiss} className="waves-light btn red">Cancel</a>
            </div>
          </div>
          <div className="col s6">
            <div className="pull-right">
              <button type="submit" className="waves-light btn teal darken-4">Save</button>
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
      user: {
        id: "",
        name: "",
        lastName: "",
        email: "",
        login: "",
        password: "",
        roles: []
      },
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
    temp.detail = user.username;
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
  }

  handleCreate() {
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

  prevPage(list) {
    let state = this.state;
    if (state.current > 1) {
      state.current--;
      this.applyPagination();
    }
    this.setState(state);
  }

  nextPage() {
    let state = this.state;
            if ( (this.state.listOfUser.length > ((state.current) * this.state.usersByPage)) ) {
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

  render() {

    this.state.listOfUser = this.applyFiltering(this.props.users);

    this.applyPagination();
    let displayed = this.state.usersByPage;
    if (this.state.listOfUser.length < displayed)
      displayed = this.state.listOfUser.length

    let detailAreaStatus = "";
    if (this.state.create || this.state.edit) detailAreaStatus = " create";
    if (this.state.detail) detailAreaStatus = " selected";
    return (
      <span>

        {/* TODO promote this */}
        <div className="row z-depth-2 userSubHeader" id="inner-header">
          {/* <div className="col s12 z-depth-2 userSubHeader"> */}
              <div className="col s6 m10">List of Users</div>
              <div className="col s6 m2 button">
                <a className="waves-effect waves-light btn right" onClick={this.handleCreate}>New User</a>
              </div>
          {/* </div> */}
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
                <div className="col s4 userCanvasfooter">
                  <div className="col s12 m6">Showing {displayed} of {this.state.listOfUser.length}</div>
                  <div className="col s6 m3">
                    <a onClick={this.prevPage}><i className="fa fa-chevron-left paddingRight10"></i>Prev</a>
                  </div>
                  <div className="col s6 m3 ">
                    <a onClick={this.nextPage}>Next<i className="fa fa-chevron-right paddingLeft10"></i></a>
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
                          save={UserActions.addUser}
                          title="New User"/>
            ) : this.state.edit != undefined ? (
                <EditItem user={this.state.user}
                          handleFieldChange={this.handleFieldChange}
                          clearSelection={this.clearSelection}
                          editUser={this.editUser}
                          updateUser={this.updateUser}/>
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
