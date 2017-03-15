import React, { Component } from 'react';

function PageHeader(props) {
  return (
    <div className="page-header">
      <div className="title-area">
        <div className="page-title caps">{props.title}</div>
        <div className="page-subtitle">{props.subtitle}</div>
      </div>
      <div className="page-actions">
        {props.children}
      </div>
    </div>
  )
}

export default PageHeader;
