import React, { useState, useRef, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import courselist from '../assets/images/course-list-img.png';
import activityfile from '../assets/images/main-banner-img.png';
import H5PEditor from '../H5PComponents/H5PEditors';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { Web3Auth } from '@web3auth/modal';
import { ADAPTER_EVENTS } from '@web3auth/base';
import JSZip from 'jszip';
import Modal from 'react-bootstrap/Modal';
// import Myc2eOverview from './myc2eoverview';
import Header from './header';

import upload from '../assets/images/upload (1).svg';

const Myc2e = () => {
  // const [contentData, setcontentData] = useState();
  // const [contentDetail, setcontentDetail] = useState(null);
  // const [projectJSON, setProjectJSON] = useState(null);

  // const [loadzipper, setloadzipper] = useState(null);
  const [web3auth, setWeb3auth] = useState(null);
  const [walletConnection, setWalletConneciton] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);

  const [c2e, c2edetail] = useState(null);
  const [projects, setProjects] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [JSlipParser, setJSlipParser] = useState(null);
  const [allFiles, setAllFIles] = useState(null);
  const inp = useRef();

  useEffect(() => {
    if (JSlipParser) {
      const contents = [];
      JSlipParser.forEach((relativePath, zipEntry) => {
        contents.push(zipEntry.name);
      });
      setAllFIles(contents);
    }
  }, [JSlipParser]);

  useEffect(() => {
    (async () => {
      if (allFiles) {
        const c2edata = await returnContentFromUrl('c2e.json');
        c2edetail(c2edata);
        const result = await returnContentFromUrl('/content/contents.json');
        console.log(result);
        if (result) {
          // projects
          const AllProjects = result?.c2eContents.filter(
            (data) => data.learningResourceType === 'Project'
          );
          const allProjectData = [];
          for (let i = 0; i < AllProjects?.length; i++) {
            const AllProjectsData = await returnContentFromUrl(
              AllProjects[i]?.url
            );

            allProjectData.push(AllProjectsData);
          }

          setProjects(allProjectData);

          //playlist
          const AllPlaylist = result?.c2eContents.filter(
            (data) => data.learningResourceType === 'Playlist'
          );
          const allPlaylistData = [];
          for (let i = 0; i < AllPlaylist?.length; i++) {
            const playlistData = await returnContentFromUrl(
              AllPlaylist[i]?.url
            );

            allPlaylistData.push(playlistData);
          }

          setplaylists(allPlaylistData);

          //activities
          const AllActivities = result?.c2eContents.filter(
            (data) => data.learningResourceType === 'Activity'
          );
          const allActivitiesData = [];
          for (let i = 0; i < AllActivities?.length; i++) {
            const activityData = await returnContentFromUrl(
              AllActivities[i]?.url
            );

            allActivitiesData.push(activityData);
          }
          setActivity(allActivitiesData);
        }
      }
    })();
  }, [allFiles]);

  const returnContentFromUrl = async (url) => {
    for (var i = 0; i < allFiles.length; i++) {
      const contentRead = await JSlipParser.files[allFiles[i]].async('text');

      if (allFiles[i].includes(url)) {
        const data = JSON.parse(contentRead);
        return data;
      }
    }
    return;
  };

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
    <div className="reader-c2e">
      <Header web3auth={web3auth} walletConnection={walletConnection} />
      {!projects?.length ? (
        <div className="reader-main">
          {/*<div className="img-box">
            <img src={c2e} alt="logo" />
           </div>*/}

          {walletConnection ? (
            <div className="login-text text-detail">
              <h3>How does it work?</h3>
              <p>
                After you have licensed a C2E from a digital marketplace, you
                will receive an email with instructions on how to download it.
                <br /> After the C2E is in your hand, you can open it in a C2E
                reader, like this one.
              </p>
            </div>
          ) : (
            <div className="text-detail">
              <h5>Imagine a world…</h5>
              <p>
                … where access to high quality learning resources is equitable,
                affordable, and widely available. <br />
                <br /> … where digital content creators have access to resources
                and incentives to build quality interactive learning
                experiences, and marketplaces where they can get paid fairly for
                their efforts.
                <br /> <br /> … where the quality and appropriateness of digital
                educational content can be vetted before it enters a
                marketplace.
              </p>
            </div>
          )}

          <div className="uploadBox">
            <div className="box">
              <h1>Curriki Educational Experiences Reader</h1>
              {walletConnection && (
                <div className="iconbox">
                  <CircularProgressbarWithChildren value={uploadProgress}>
                    <img src={upload} alt="" />
                  </CircularProgressbarWithChildren>
                </div>
              )}
              {walletConnection ? (
                <p className="text">Upload C2E from your local device</p>
              ) : (
                <p className="text text-space">
                  Log In and Experience C2Es NOW
                </p>
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
                  const loadzip = await JSZip.loadAsync(e.target.files[0]);
                  setJSlipParser(loadzip);
                  // console.log('name', e.target.files);
                  // const loadzip = await JSZip.loadAsync(e.target.files[0]); //  read the zip file
                  // if (!loadzip.files['c2e.json']) {
                  //   alert('please uplaod only C2E Project, c2e.json not found.');
                  //   return false;
                  // } else {
                  //   // set state for all zip files
                  //   setloadzipper(loadzip);
                  // }

                  // const contents = [];
                  // const contentsDetail = [];
                  // loadzip.forEach((relativePath, zipEntry) => {
                  //   // load inner content for each file
                  //   contents.push(zipEntry.name);
                  // });
                  // setcontentData(contents);
                  // // iterate each file through loop
                  // for (var i = 0; i < contents.length; i++) {
                  //   const contentRead = await loadzip.files[contents[i]].async('text');
                  //   contentsDetail.push(contentRead);

                  //   if (contents[i].includes('c2e.json') && !contents[i].includes('activities')) {
                  //     const c2edata = JSON.parse(contentRead);
                  //     c2edata?.c2eContain?.[0].c2eResources?.map(async (resource) => {
                  //       // set project json after filter
                  //       if (resource.url === 'project.json') {
                  //         const contentProject = await loadzip.files['project.json'].async('text');
                  //         setProjectJSON(JSON.parse(contentProject));
                  //       }

                  //       // extract array  of playlist depend on directory present in resoruce folder
                  //       if (
                  //         resource.fileFormat === 'directory' &&
                  //         resource.url !== 'activities' &&
                  //         resource.url !== 'playlists'
                  //       ) {
                  //         setplaylists((prevplaylists) => [...prevplaylists, resource.url]);
                  //       }
                  //     });
                  //   }
                  // }
                  // setcontentDetail(contentsDetail);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="playlist-informtion">
          {/* <button
            onClick={() => {
              setcontentDetail();initModal
            }}
          >
            Back
          </button> */}

          <div>
            <div className="second-view">
              <div className="info">
                <img src={courselist} alt="" id="course-image" />
                <h4>{projects[0]?.title}</h4>
                <p>{projects[0]?.description}</p>
                {/* <div className="overview-description">
              <h4>Marketplace:</h4>
              <p>Bill’s Marketplace</p>
            </div> */}
                <div className="overview-description">
                  <h5>Author:</h5>
                  <p>{c2e?.c2eMetadata?.author?.name}</p>
                  <p>{c2e?.c2eMetadata?.author?.email}</p>
                </div>
                <div className="overview-description">
                  <h5>Publisher:</h5>
                  <p>{c2e?.c2eMetadata?.publisher?.name}</p>
                  <p>{c2e?.c2eMetadata?.publisher?.email}</p>
                </div>
                <div className="overview-description">
                  <h5>Copyrights:</h5>
                  <p>{c2e?.c2eMetadata?.copyright?.copyrightHolder?.name}</p>
                  <p>{c2e?.c2eMetadata?.copyright?.copyrightHolder?.email}</p>
                  <p>{c2e?.c2eMetadata?.copyright?.copyrightHolder?.url}</p>
                  <p>{c2e?.c2eMetadata?.copyright?.copyrightNotice}</p>
                  <p>{c2e?.c2eMetadata?.copyright?.copyrightYear}</p>
                </div>
                <div className="overview-description">
                  <h5>Version:</h5>
                  <p>{c2e?.c2eMetadata?.lifecycle?.version}</p>
                </div>
              </div>
              <div className="accordian-c2e">
                <Accordion defaultActiveKey="0">
                  {playlists?.map((playlist, key) => {
                    return (
                      <Accordion.Item eventKey={String(key)}>
                        <Accordion.Header>{playlist?.title}</Accordion.Header>
                        {activity?.map((activity) => {
                          return (
                            <Accordion.Body>
                              <div className="activity-detail" onClick={()=>{
                                 setActivityh5p(activity)
                                setModalShow(true)
                              }}>
                                <img src={activityfile} alt="" />
                                {activity?.title}
                              </div>
                            </Accordion.Body>
                          );
                        })}
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              </div>

              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                activityh5p={activityh5p}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function MyVerticallyCenteredModal(props) {
  const {activityh5p} = props
  console.log(activityh5p)
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          C2E Player
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {!!activityh5p && (
                <div style={{ flex: 15 }}>
                  <H5PEditor h5p={activityh5p.h5pSettingsJson?.h5p} />
                </div>
              )}
      </Modal.Body>
    </Modal>
  );
}

export default Myc2e;
