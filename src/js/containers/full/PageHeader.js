import React, { Component } from 'react';

function PageHeader(props) {
  return (
    <div className="page-header">
      <div className="data">
        <div className="title-area">
          <div className="page-title caps">{props.title}</div>
          <div className="page-subtitle">{props.subtitle}</div>
        </div>
        <div className="page-actions">
          {props.children}
        </div>
      </div>
    </div>
  )
}

function ActionHeader(props) {
  return (
    <span>
      <div className="inner-header">
        <div className="title">{props.title}</div>
        <div className="actions">{props.children}</div>
      </div>
      <div className="inner-header-placeholder">
        {/* Helps the positioning of content *below* the header */}
      </div>
    </span>
  )
}

export { PageHeader, ActionHeader };
