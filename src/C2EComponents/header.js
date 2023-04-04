import React, { useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { ADAPTER_EVENTS } from '@web3auth/base';

import logo from '../assets/images/logo.png';
const Header = () => {
  const [web3auth, setWeb3auth] = useState(null);
  const [walletConnection, setWalletConneciton] = useState(null);

  useEffect(() => {
    (async () => {
      const web3auth = new Web3Auth({
        clientId:
          'BOweQo3kUPEy3FhGecCQrT30eF99IpGky0kIrCwev_wuSbCBvCQmSHpMVQTIa2yL6p0c6FB_sC5J-cIbhBNGOKs',
        chainConfig: {
          chainNamespace: 'eip155',
          chainId: '0x1',
        },
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
        console.log('connected to wallet', web3auth);

        const user = await web3auth.getUserInfo();
        setWalletConneciton(user);
        console.log(
          '🚀 ~ file: signup-web3auth.js:46 ~ getUserInfo ~ user:',
          user
        );

        // web3auth.provider will be available here after user is connected
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log('connecting');
      });
      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log('disconnected');
        setWalletConneciton(null);
      });

      setWeb3auth(web3auth);

      await web3auth.initModal();
    })();
  }, []);
  const login = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    await web3auth.connect();
  };
  const logout = async () => {
    if (!web3auth) {
      console.log('provider not initialized yet');
      return;
    }

    await web3auth.logout();
  };

  return (
    <div className="header">
      <img src={logo} alt="logo" className="header-logo" />
      {walletConnection ? (
        <div className="login-user">
          <div className="user-info">
            <img src={walletConnection?.profileImage} alt="" />
            <h2>Welcome {walletConnection?.name}</h2>
          </div>
          <button className="login" onClick={() => logout()}>
            Logout
          </button>
        </div>
      ) : (
        <button className="login" onClick={() => login()}>
          login
        </button>
      )}
    </div>
  );
};

export default Header;
