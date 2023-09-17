import React, { useContext } from 'react';
import C2ELogo from '../assets/images/c2e-logo-white.svg';
// import { useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import { googleLogout } from '@react-oauth/google'; 

const Header = () => {
  const user = useContext(UserContext);

  return (
    <div className="header">
      <img src={C2ELogo} alt="logo" className="header-logo" />
      {user && (
        <div className="login-user">
          <div className="user-info">
            <img src={user.picture} alt="" />
            {/* <h2>{user.name}</h2> */}
          </div>
          <button
            className="login"
            onClick={() => {
              googleLogout();
              localStorage.removeItem('oAuthToken');
              window.location.reload();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
