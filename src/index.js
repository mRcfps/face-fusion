import React from 'react';
import ReactDOM from 'react-dom';

// import global css
import './components/css/index.css';

// import react-router for navigation in web pages
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

// import all components in one place
import {
  App,
  HomePage,
} from './components/';

const Root = () => (
  <Router>
    <div className="subRoot">
      <Route exact path="/" component={App} />
      <Route path="/homePage" component={HomePage} />
    </div>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
