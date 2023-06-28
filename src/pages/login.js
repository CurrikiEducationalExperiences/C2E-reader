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
        <h1 className="login-banner-heading">
          WELCOME TO <span>C2E</span>
        </h1>

        <div className="sub-banner-alert-heading">
          <h1>
            STEP INTO A WORLD WHERE <br /> LEARNING IS AN EXTRAORDINARY <br />
            <span>ADVENTURE</span>
          </h1>

          <p className="sub-text">
            Get ready to be captivated by wonder of <span>C2E</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
