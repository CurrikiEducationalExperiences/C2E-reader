
import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { UserContext } from '../App';
import { Redirect } from 'react-router-dom';
import C2ELogo from '../assets/images/c2e-logo.svg';

const Login = () => {
  console.log('login init');
  const user = useContext(UserContext);

  return (
    <div className="login-conrainer">
      {user && <Redirect to="/" />}
      <div className="login-banner">
        <div className="sub-banner-alert-heading">
          <h1 className="login-banner-heading">
            Welcome To <span>Curriki Educational Experiences</span>
          </h1>
          <h1>
            STEP INTO A WORLD WHERE <br /> LEARNING IS AN  <br />
            <span>EXTRAORDINARY ADVENTURE</span>
          </h1>

          <p className="sub-text">
            Get ready to be captivated by the wonder of  <span> Curriki Educational Experiences</span> (C2E)
          </p>
        </div>
        <div className="google-login-button">
          <div className="card p-4" >
            <img src={C2ELogo} className="card-img-top" alt="C2E Logo" />
            <div className="card-body">
              <h5 className="card-title">Sign In</h5>
              <p className="card-text">Your C2E wallet in one-click</p>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  localStorage.setItem('oAuthToken', credentialResponse.credential);
                  window.location.reload();
                }}
                onError={() => {
                  console.log('Login Failed');
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
