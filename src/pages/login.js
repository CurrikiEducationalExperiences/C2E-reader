import React, { useEffect } from 'react';

const Login = ({ web3auth }) => {
  const login = async () => {
    if (web3auth) {
      setTimeout(() => {
        web3auth.connect().then((data) => console.log(web3auth));
      }, [2000]);
    }
  };
  useEffect(() => {
    login();
  }, [web3auth]);

  return (
    <div className="login-conrainer">
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
      </div>
    </div>
  );
};

export default Login;
