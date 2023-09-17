import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Myc2e from './C2EComponents/myc2e';
import Myc2ePreview from './C2EComponents/myc2e-preview';
// import Home from './pages/Home/home';
// import Overview from './pages/Overview/overview';
import Login from './pages/login';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './C2EComponents/header';
export const UserContext = createContext(null);
function App() {
  const OAuthClientId = '1033463348275-lsniv7sgkmhdfsdk092bbhln9s9ld14k.apps.googleusercontent.com';
  const token = localStorage.getItem('oAuthToken');
  const user = token ? jwt_decode(token) : null;

  return (
    <GoogleOAuthProvider clientId={OAuthClientId}>
      <UserContext.Provider value={user}>
        <Router>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/preview">
              <div className="header-container">
                <Header />
              </div>
              <Myc2ePreview />
            </Route>
            <ProtectedRoute>
              <Route exact path="/">
                <div className="header-container">
                  <Header />
                </div>
                <Myc2e />
              </Route>
              <Route path="/testpath">
                <div>Login successful</div>
              </Route>
            </ProtectedRoute>
          </Switch>
        </Router>
      </UserContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;

const ProtectedRoute = ({ children }) => {
  console.log('protected init');
  const user = useContext(UserContext);
  if (user) {
    return children;
  }

  return <Redirect to="/login" />;
};
/*
const UnProtectedRoute = ({ session, children }) => {
  return !session && children;
};
*/