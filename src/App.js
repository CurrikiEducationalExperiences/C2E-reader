import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import logo from "./logo.svg";
import Myc2e from "./C2EComponents/myc2e";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Myc2e />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
