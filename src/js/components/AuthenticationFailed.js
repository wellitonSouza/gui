import React, { Component } from 'react';

export default function AuthenticationFailed(props) {
  return (
    <div className="full-height relative background-info">
      <div className="valign-wrapper center-align full-height todo-div">
        <div className="full-width">
          <i className="material-icons">lock_outline</i>
          <div>You don't have access to this area.</div>
        </div>
      </div>
    </div>
  )
}
