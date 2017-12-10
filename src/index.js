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
  SelectScene,
} from './components/';

const Root = () => (
  <Router>
    <div className="subRoot">
      <Route exact path="/" component={App} />
      <Route path="/homePage" component={HomePage} />
      <Route path="/selectScene" component={SelectScene} />
    </div>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
