import React, { Component } from 'react';
import tencentyoutuyun from './face_sdk/';

const appid = '10110669'
const secretId = 'AKID65vwrbipAJC0c4hUP7g9RYTFsKaf2MzQ';
const secretKey = 'Yu42aCqrjw2viPvEQNaL5dxNjutkOq69';
const userid = 0;

class App extends Component {
  handleClick = () => {
    tencentyoutuyun.setAppInfo(appid, secretId, secretKey, String(userid++))
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.handleClick}>开始融合</button>
      </div>
    );
  }
}

export default App;
