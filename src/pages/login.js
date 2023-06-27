import React, { useState, useEffect } from 'react';

import 'react-circular-progressbar/dist/styles.css';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Web3Auth } from '@web3auth/modal';
import { ADAPTER_EVENTS } from '@web3auth/base';

import C2ELogo from '../assets/images/logo.png';

const Login = () => {
  const [web3auth, setWeb3auth] = useState(null);

  const login = async () => {
    console.log('web3auth.connect()');
    setTimeout(() => {
      web3auth.connect();
    }, [3000]);
  };

  useEffect(() => {
    if (web3auth) {
      console.log('web3auth', web3auth);
      login();
    }
  }, [web3auth]);

  useEffect(() => {
    (async () => {
      const web3auth = new Web3Auth({
        clientId:
          'BNW0_55WnZZSF6hjmoLGsx2d7NQ_KHuFQnsGOPUPjwWDJAAiT-9iBfu_TeLRkLH3NiKfao04OgEgeCS86JfSFeo',
        chainConfig: {
          chainNamespace: 'eip155',
          chainId: '0x1',
        },
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
        console.log('connected to wallet', web3auth);

        const user = await web3auth.getUserInfo();
        // setWalletConneciton(user);
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
        // setWalletConneciton(null);
      });

      setWeb3auth(web3auth);
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: 'testnet',
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal();
    })();
  }, []);

  return (
    <div className="login-conrainer">
      <div className="login-banner">
        <h1 className="login-banner-heading">
          WELCOME TO <span>C2E</span>
        </h1>
      </div>
      <div className="login-form">
        <img src={C2ELogo} alt="c2e logo" className="c2e-logo" />
        {/* <div className="main-form-wrapper">
          <button onClick={() => login()}>LET’s GET STARTED!</button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
