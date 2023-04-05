import React, { useState, useRef } from 'react';
import c2e from '../assets/images/c2e.png';

import { Web3Auth } from '@web3auth/modal';
import { ADAPTER_EVENTS } from '@web3auth/base';
import upload from '../assets/images/upload (1).svg';
import JSZip from 'jszip';
import Myc2eOverview from './myc2eoverview';
import Header from './header';
import { useEffect } from 'react';
const Myc2e = () => {
  const [contentData, setcontentData] = useState();
  const [contentDetail, setcontentDetail] = useState(null);
  const [projectJSON, setProjectJSON] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [loadzipper, setloadzipper] = useState(null);
  const [web3auth, setWeb3auth] = useState(null);
  const [walletConnection, setWalletConneciton] = useState(null);
  const inp = useRef();

  const login = async () => {
    if (!web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    await web3auth.connect();
  };

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
        setWalletConneciton(user);
        console.log('🚀 ~ file: signup-web3auth.js:46 ~ getUserInfo ~ user:', user);

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

  return (
    <div className="reader-c2e">
      <Header web3auth={web3auth} walletConnection={walletConnection} />
      {!contentDetail ? (
        <div className="reader-main">
          {/*<div className="img-box">
            <img src={c2e} alt="logo" />
           </div>*/}

          {walletConnection ? (
            <div className="login-text">
              <h3>How does it work?</h3>
              <p>
                After you have licensed a C2E from a digital marketplace, you will receive an email
                with instructions on how to download it.
                <br /> After the C2E is in your hand, you can open it in a C2E reader, like this
                one.
              </p>
            </div>
          ) : (
            <div className="text-detail">
              <h5>Imagine a world…</h5>
              <p>
                … where access to high quality learning resources is equitable, affordable, and
                widely available. <br />
                <br /> … where digital content creators have access to resources and incentives to
                build quality interactive learning experiences, and marketplaces where they can get
                paid fairly for their efforts.
                <br /> <br /> … where the quality and appropriateness of digital educational content
                can be vetted before it enters a marketplace.
              </p>
            </div>
          )}

          <div className="uploadBox">
            <div className="box">
              <h1>Curriki Educational Experiences Reader</h1>
              {walletConnection && (
                <div
                  className="iconbox"
                  onClick={() => {
                    inp.current.click();
                  }}
                >
                  <img src={upload} alt="logo" />
                </div>
              )}
              {walletConnection ? (
                <p className="text">Upload C2E from your local device</p>
              ) : (
                <p className="text text-space">Log In and Experience C2Es NOW</p>
              )}
              {walletConnection ? (
                <button
                  onClick={() => {
                    inp.current.click();
                  }}
                >
                  Choose File
                </button>
              ) : (
                <button onClick={() => login()}>LET’s GET STARTED!</button>
              )}
              <input
                ref={inp}
                type="file"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  console.log('name', e.target.files);
                  const loadzip = await JSZip.loadAsync(e.target.files[0]); //  read the zip file
                  if (!loadzip.files['c2e.json']) {
                    alert('please uplaod only C2E Project, c2e.json not found.');
                    return false;
                  } else {
                    // set state for all zip files
                    setloadzipper(loadzip);
                  }

                  const contents = [];
                  const contentsDetail = [];
                  loadzip.forEach((relativePath, zipEntry) => {
                    // load inner content for each file
                    contents.push(zipEntry.name);
                  });
                  setcontentData(contents);
                  // iterate each file through loop
                  for (var i = 0; i < contents.length; i++) {
                    const contentRead = await loadzip.files[contents[i]].async('text');
                    contentsDetail.push(contentRead);

                    if (contents[i].includes('c2e.json') && !contents[i].includes('activities')) {
                      const c2edata = JSON.parse(contentRead);
                      c2edata?.c2eContain?.[0].c2eResources?.map(async (resource) => {
                        // set project json after filter
                        if (resource.url === 'project.json') {
                          const contentProject = await loadzip.files['project.json'].async('text');
                          setProjectJSON(JSON.parse(contentProject));
                        }
                        // extract array  of playlist depend on directory present in resoruce folder
                        if (
                          resource.fileFormat === 'directory' &&
                          resource.url !== 'activities' &&
                          resource.url !== 'playlists'
                        ) {
                          setplaylists((prevplaylists) => [...prevplaylists, resource.url]);
                        }
                      });
                    }
                  }
                  setcontentDetail(contentsDetail);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="playlist-informtion">
          <button
            onClick={() => {
              setcontentDetail();
            }}
          >
            Back
          </button>
          <Myc2eOverview
            playlistsContent={playlists}
            setActivityh5p={setActivityh5p}
            contentDetail={contentDetail}
            contents={contentData}
            loadzipper={loadzipper}
            activityh5p={activityh5p}
          />
        </div>
      )}
      <footer class="footer-all">
        <a
          rel="noreferrer"
          class="footer-link"
          href="https://www.curriki.org/terms-of-service/"
          target="_blank"
        >
          Terms of Use
        </a>
        <a
          rel="noreferrer"
          class="footer-link"
          href="https://www.curriki.org/privacy-policy/"
          target="_blank"
        >
          Privacy Policy
        </a>
        <a
          rel="noreferrer"
          class="footer-link"
          href="https://www.currikistudio.org/help/"
          target="_blank"
        >
          Help Center
        </a>
      </footer>
    </div>
  );
};

export default Myc2e;
