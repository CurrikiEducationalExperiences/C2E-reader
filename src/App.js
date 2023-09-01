import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Myc2e from './C2EComponents/myc2e';
import Myc2ePreview from './C2EComponents/myc2e-preview';
// import Home from './pages/Home/home';
// import Overview from './pages/Overview/overview';
import Login from './pages/login';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './C2EComponents/header';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';


import { ADAPTER_EVENTS } from '@web3auth/base';

function App() {
  const [walletConnection, setWalletConneciton] = useState(null);
  const [web3auth, setWeb3auth] = useState(null);
  const [session, setSession] = useState();

  useEffect(() => {
    (async () => {
      const web3auth = new Web3Auth({
        clientId:
          'BNW0_55WnZZSF6hjmoLGsx2d7NQ_KHuFQnsGOPUPjwWDJAAiT-9iBfu_TeLRkLH3NiKfao04OgEgeCS86JfSFeo',
        chainConfig: {
          chainNamespace: 'eip155',
          chainId: '0x1',
        },
        uiConfig :{
          appName: "C2E",
          appLogo: "https://franklyapp.netlify.app/web3wallet.png"
        }
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
        console.log('connected to wallet', web3auth);

        const user = await web3auth.getUserInfo();
        setWalletConneciton(user);
        if (window.location.pathname?.includes('login')) {
          window.location.href = '/';
        }
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        setWalletConneciton(null);
      });

      setWeb3auth(web3auth);
      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          network: 'testnet',
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal();
      setWeb3auth(web3auth);
      if (web3auth?.status === 'connected') {
        setSession(true);
        if (window.location.pathname?.includes('login')) {
          window.location.href = '/';
        }
      } else {
        if (!window.location.pathname?.includes('login') && !window.location.pathname?.includes('preview')) {
          window.location.href = '/login';
        }
      }
    })();
  }, []);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <ProtectedRoute session={session}>
            <div className="header-container">
              <Header web3auth={web3auth} walletConnection={walletConnection} />
            </div>
            <Myc2e walletConnection={walletConnection} />
          </ProtectedRoute>
        </Route>
        <Route exact path="/preview">
          <div className="header-container">
            <Header web3auth={web3auth} walletConnection={walletConnection} />
          </div>
          <Myc2ePreview walletConnection={walletConnection} />
        </Route>
        <Route exact path="/login">
            <Login web3auth={web3auth} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

const ProtectedRoute = ({ session, children }) => {
  return session && children;
};

const UnProtectedRoute = ({ session, children }) => {
  return !session && children;
};
