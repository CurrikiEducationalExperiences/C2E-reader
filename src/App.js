import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Myc2e from './C2EComponents/myc2e';
import Home from './pages/Home/home';
import Overview from './pages/Overview/overview';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Myc2e />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/overview">
          <Overview />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
