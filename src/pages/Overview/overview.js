import React, { useEffect, useState } from 'react';
import { Accordion, Tab, Tabs } from 'react-bootstrap';
import BannerImg from '../../assets/images/s2e-banner.png';
import H5PEditor from '../../H5PComponents/H5PEditors';
import './style.css';

const Overview = ({
  activityh5p,
  setActivityh5p,
  playlists,
  activity,
  setModalShow,
  activeC2E,
}) => {
  const [key, setKey] = useState('Content');

  useEffect(() => {
    setActivityh5p(activity[0]);
  }, [activity, setActivityh5p]);
  return (
    <div className="overview-wrapper">
      <div className="main-container mikes">
        <div className="sub-heading-wrapper">
          <h2 className="card-name">{activeC2E?.c2eMetadata?.general?.title}</h2>

          <button
            onClick={() => {
              setModalShow(false);
            }}
          >
            Back
          </button>
        </div>

        <div className="overview-c2e">
          <div className="tabs-wrapper">
            <br />
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="Content" title="Content">
                <h2 className="playlist-heading">Playlists</h2>
                <div className="playlist-accordion">
                  <Accordion defaultActiveKey="0">
                    {playlists.length > 0 && playlists?.map((playlist, key) => {
                      return (
                        <Accordion.Item eventKey={String(key)}>
                          <Accordion.Header>{playlist?.title}</Accordion.Header>
                          {activity?.map((activity) => {
                            return (
                              <Accordion.Body>
                                <div
                                  role="button"
                                  className={activityh5p && activity["@id"] === activityh5p["@id"] ? "activity-detail selected-activity" : "activity-detail"}
                                  onClick={() => {
                                    setActivityh5p(activity);
                                  }}
                                >
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
              <Tab eventKey="Overview" title="Details">
                <div className="c2e-details">
                  <div>
                    <h5>Description</h5>
                    <p>{activeC2E?.c2eMetadata?.general?.description}</p>
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
                    <p>
                      {activeC2E?.c2eMetadata?.copyright?.copyrightHolder?.name}
                    </p>
                    <p>
                      {activeC2E?.c2eMetadata?.copyright?.copyrightHolder?.email}
                    </p>
                    <p>
                      {activeC2E?.c2eMetadata?.copyright?.copyrightHolder?.url}
                    </p>
                    <p>{activeC2E?.c2eMetadata?.copyright?.copyrightNotice}</p>
                    <p>{activeC2E?.c2eMetadata?.copyright?.copyrightYear}</p>
                  </div>
                  <div className="overview-description">
                    <h5>Version:</h5>
                    <p>{activeC2E?.c2eMetadata?.lifecycle?.version}</p>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
          <div className="player">
            {activityh5p ? (<H5PEditor h5p={activityh5p?.h5pSettingsJson?.h5p} />) : (
              <div className="banner-img">
                <img src={BannerImg} alt="banner" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Overview;



// const SliderData = () => {
//   const settings = {
//     arrows: false,
//     dots: false,
//     infinite: true,
//     autoplay: true,
//     speed: 3500,
//     autoplaySpeed: 3000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   };
//   return (
//     <div>
//       <Slider {...settings}>
//         <div className="">
//           <Banner
//             blueText="C2E ensures that your digital documents are effortlessly accessible anytime, "
//             yellowText="anywhere."
//           />
//         </div>
//         <div className="">
//           <Banner
//             blueText="C2E incorporates robust security measures, safeguarding your digital documents against unauthorized access,"
//             yellowText=" piracy, and data breaches."
//           />
//         </div>
//         <div className="">
//           <Banner
//             blueText="C2E allows content creators like you to embed licensing information directly into the digital documents, "
//             yellowText="preventing unauthorized use"
//           />
//         </div>
//         <div className="">
//           <Banner
//             blueText="C2E ensures that intellectual property rights are respected, and  that the creators, the visionaries, "
//             yellowText="the architects of knowledge are duly recognized and rewarded."
//           />
//         </div>
//       </Slider>
//     </div>
//   );
// };

