import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import detail from '../views/devices/detail';


class ConfirmModal extends Component {
  constructor(props) {
    super(props)

    this.openModal = this.openModal.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  openModal(statusModal){
    this.props.openModal(statusModal);
  }

  confirm(event){
    //TODO - make this button work
    console.log("TODO - Makes this operation work");
  }

  render(){
    let title = "Confirm Operation";
    let message = "Are you confirm this operation";
    return(
        <GenericModal title={title} first_message={message} btnLabel={"Confirm"} openModal={this.openModal}/>
    )
  }
}


class RemoveModal extends Component {
  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.remove = this.remove.bind(this);
  }

  openModal(statusModal){
    this.props.openModal(statusModal);
  }

  remove(event){
    event.preventDefault();
    this.props.remove(event);
  }

  render(){
    let title = "Remove " + this.props.name;
    let first_message = "Are you sure you want remove this";
    let second_message = this.props.name;
    return(
      <GenericModal title={title} first_message={first_message} second_message={second_message}
                            openModal={this.openModal} remove={this.remove} btnLabel={"Remove"}/>
    )
  }
}

class GenericModal extends Component {
  constructor(props) {
    super(props);

    this.dismiss = this.dismiss.bind(this);
    this.remove = this.remove.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  dismiss(){
    this.props.openModal(false);
  }

  remove(event){
    event.preventDefault();
    this.props.remove(event);
  }

  confirm(event){
    //TODO - Make this operation work
  }

  render(){
    return (
      <div className="">
        <div className="row confirm-modal">
          <div className="confirm-modal-head">
            <div className="col s3 img-alert">
              <div><i className="fa fa-exclamation-triangle fa-4x" /></div>
            </div>
            <div className="col s9 message">
              <div className="message-title left">{this.props.title}</div>
              <div className="message-subtitle left">{this.props.first_message}</div>
              <div className="message-subtitle left">{this.props.second_message}?</div>
            </div>
          </div>
          <div className="confirm-modal-footer">
            <div  className="col s6"><a className="waves-effect waves-light btn btn-light" id="btn-dismiss" tabIndex="-1" title="Cancel" onClick={this.dismiss}>Cancel</a></div>
            <div className="col s6"><a className="waves-effect waves-light btn" id="btn-action" tabIndex="-1" title="Remove" onClick={this.remove}>{this.props.btnLabel}</a></div>
          </div>
        </div>
        <div className="modal-background" onClick={this.dismiss}></div>
      </div>
    )
  }
}

export { GenericModal, RemoveModal, ConfirmModal };
