import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import './../styles/index.scss';
import Home from './Home';
import Loading from './Loading';
import Payments from './Payments';
import Shipments from './Shipments';

const Login = importedComponent(
  () => require('./Login'),
  {
    LoadingComponent: Loading
  }
);

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route exact path="/application-servers" component={Home} />
          <Route exact path="/payments" component={Payments} />
          <Route exact path="/shipments" component={Shipments} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;