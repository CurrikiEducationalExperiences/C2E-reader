import React from 'react';
import logo from '../assets/images/logo.png';

import { useHistory  } from "react-router-dom";

const Header = ({ web3auth, walletConnection }) => {
  const logout = async () => {
    if (!web3auth) {
      console.log('provider not initialized yet');
      return;
    }

    await web3auth.logout();
    history.push("/login");
  };
  const history = useHistory()

  return (
    <div className="header">
      <img src={logo} alt="logo" className="header-logo" />
      {walletConnection ? (
        <div className="login-user">
          <div className="user-info">
            <img src={walletConnection?.profileImage} alt="" />
            {/* <h2>{walletConnection?.name}</h2> */}
          </div>
          <button
            className="login"
            onClick={() => {
              logout();

            }}
          >
            Logout
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Header;
