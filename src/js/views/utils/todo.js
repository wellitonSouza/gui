import React, { Component } from 'react';

export default function Todo(props) {
  console.log('will render todo');
  return (
    <div className="full-height relative background-info">
      <div className="valign-wrapper center-align full-height">
        <div className="full-width">
          <i className="material-icons">new_releases</i>
          <div>This feature is not yet implemented.</div>
          <div>Do check back soon!</div>
        </div>
      </div>
    </div>
  )
}
