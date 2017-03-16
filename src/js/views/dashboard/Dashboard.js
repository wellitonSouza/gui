import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default function (props) {
  return (
    <ReactCSSTransitionGroup
        transitionName="first"
        transitionAppear={true}
        transitionAppearTimeout={200}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500} >

      <div>
        <h1>This is a dashboard! -&-</h1>
      </div>

    </ReactCSSTransitionGroup>
  )
}
