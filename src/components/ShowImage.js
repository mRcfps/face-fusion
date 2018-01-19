import React, { Component } from 'react';

import { history } from './HomePage';
// import './css/s'

export default class ShowImage extends Component {
  render() {
    const state = history.location.state;
    console.log('state', state);
    return (
      <div>
        hhhh
      </div>
    );
  }
}
