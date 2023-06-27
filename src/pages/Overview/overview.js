import React from 'react';
import { Accordion, Tab, Tabs } from 'react-bootstrap';
import BannerImg from '../../assets/images/s2e-banner.png';
const Overview = ({projects,setActivityh5p,setModalShow1, playlists,  activity, setModalShow, activeC2E}) => {
  return (
    <div className="main-container">
      <div className="sub-heading-wrapper">
        <h2 className="card-name">{activeC2E?.general?.title}</h2>
        <button onClick={()=>{
          setModalShow(false)
        }}>Back</button>
      </div>
      <div className="banner-img">
        <img src={BannerImg} alt="banner" />
      </div>

      <div className="tabs-wrapper">
        <Tabs
          defaultActiveKey="Overview"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Overview" title="Overview">
            <div className="c2e-details">
              <div>
                <h5>Description</h5>
                <p>
                  {activeC2E?.general?.description}
                </p>
              </div>
              <div className="overview-description">
                  <h5>Author:</h5>
                  <p>{activeC2E?.c2eMetadata?.author?.name}</p>
                  <p>{activeC2E?.c2eMetadata?.author?.email}</p>
                </div>
                <div className="overview-description">
                  <h5>Publisher:</h5>
                  <p>{activeC2E?.c2eMetadata?.publisher?.name}</p>
                  <p>{activeC2E?.c2eMetadata?.publisher?.email}</p>
                </div>
                <div className="overview-description">
                  <h5>Copyrights:</h5>
                  <p>{activeC2E?.c2eMetadata?.copyright?.copyrightHolder?.name}</p>
                  <p>{activeC2E?.c2eMetadata?.copyright?.copyrightHolder?.email}</p>
                  <p>{activeC2E?.c2eMetadata?.copyright?.copyrightHolder?.url}</p>
                  <p>{activeC2E?.c2eMetadata?.copyright?.copyrightNotice}</p>
                  <p>{activeC2E?.c2eMetadata?.copyright?.copyrightYear}</p>
                </div>
                <div className="overview-description">
                  <h5>Version:</h5>
                  <p>{activeC2E?.c2eMetadata?.lifecycle?.version}</p>
                </div>
            </div>
          </Tab>
          <Tab eventKey="profile" title="Content">
            <h2 className="playlist-heading">Playlists</h2>
            <div className="playlist-accordion">
              {/* <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Playlist #1</Accordion.Header>
                  <Accordion.Body>
                    <div className="playlist-informtion-box">
                      <div className="plylist-activity">
                        <div className="p-a-img">
                          <img src={BannerImg} alt="" />
                        </div>
                        <p>Activity #1</p>
                      </div>
                      <div className="plylist-activity">
                        <div className="p-a-img">
                          <img src={BannerImg} alt="" />
                        </div>
                        <p>Activity #1</p>
                      </div>

                      <div className="plylist-activity">
                        <div className="p-a-img">
                          <img src={BannerImg} alt="" />
                        </div>
                        <p>Activity #1</p>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion> */}
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
                                setModalShow1(true)
                              }}>
                              {/* //  <img src={activityfile} alt="" /> */}
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
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Overview;
