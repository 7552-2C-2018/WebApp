import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import importedComponent from 'react-imported-component';
import './../styles/index.scss';
import AppServers from './AppServers';
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
          <Route exact path="/" component={AppServers} />
          <Route path="/login" component={Login} />
          <Route exact path="/application-servers" component={AppServers} />
          <Route exact path="/payments" component={Payments} />
          <Route exact path="/shipments" component={Shipments} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;