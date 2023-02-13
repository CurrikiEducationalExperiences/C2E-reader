import React, { useEffect, useState } from "react";
import backicon from "../assets/images//icons/back-icon.svg";
import courselist from "../assets/images/course-list-img.png";
import updateicon from "../assets/images/update-icon.svg";
import homemenuicon from "../assets/images/icons/home-menu-icon.svg";
import searchmenuicon from "../assets/images/icons/search-menu-icon.svg";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

const Myc2eOverview = ({
  playlistsContent,
  setActivityh5p,
  contentDetail,
  contents,
  loadzipper,
}) => {
  const [totalActivities, settotalActivities] = useState([]);
  const returnIndex = (filename) => {
    return contents.indexOf(contents.filter((data, counter) => data.includes(filename))?.[0]);
  };
  useEffect(() => {
    (async () => {
      const contentsDetail = [];
      for (var i = 0; i < contents.length; i++) {
        const contentRead = await loadzipper.files[contents[i]].async("text");
        // contentsDetail.push(contentRead);
        if (contents[i].includes("/activities/c2e.json")) {
          const c2edata = JSON.parse(contentRead);
          c2edata?.c2eContain?.[1].c2eComponents?.map(async (resource) => {
            settotalActivities((prevtotalActivities) => [...prevtotalActivities, resource]);
          });
        }
      }
    })();
  }, [playlistsContent]);
  console.log("contentDetail", contentDetail);
  return (
    <div className="main-wrapper">
      {playlistsContent?.length > 0 && (
        <>
          <div className="container-fluid">
            <div className="row">
              {/* <div className="col-12">
                <div className="header-menu mb-0" onclick="history.back()">
                  <img src={backicon} width="24" height="24" />
                </div>
              </div> */}
              <div className="main-wrap">
                <div className="course-detail-wrap">
                  <div className="thumb-content">
                    <p id="course-title"></p>
                    <img src={courselist} id="course-image" />
                  </div>
                  <div className="tab-content">
                    <Tabs
                      defaultActiveKey="Overview"
                      id="uncontrolled-tab-example"
                      classNameName="mb-3"
                    >
                      <Tab className="nav-link" eventKey="Overview" title="Overview">
                        <div className="tab-content" id="myTabContent">
                          <div
                            className="tab-pane fade show active"
                            id="overview"
                            role="tabpanel"
                            aria-labelledby="overview-tab"
                          >
                            <div className="overview-description">
                              <h4>Description</h4>
                              <p id="course-description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum
                                est suspendisse tempor dui. Fringilla dis tincidunt morbi risus
                                interdum urna, odio ac. Sit in venenatis gravida enim vitae, nibh
                                blandit molestie. Et, nulla nisl laoreet vel tincidunt enim,
                                venenatis. Viverra eget lobortis massa viverra at faucibus mauris
                                suspendisse. Elit dis.
                              </p>
                            </div>
                            <div className="overview-description">
                              <h4>Marketplace:</h4>
                              <p>Bill’s Marketplace</p>
                            </div>
                            <div className="overview-description">
                              <h4>Author:</h4>
                              <p id="author-name">Jenny Wilson</p>
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab eventKey="Content" title="Content">
                        {/* <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade"
                        id="course-content"
                        role="tabpanel"
                        aria-labelledby="course-content-tab"
                      >
                        <div
                          className="tab-pane fade"
                          id="course-content"
                          role="tabpanel"
                          aria-labelledby="course-content-tab"
                        >
                          <div id="main">
                            <h4 className="playlist-head">Playlists</h4>
                            <div className="accordion" id="faq"></div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                        <div id="main">
                          <h4 className="playlist-head">Playlists</h4>
                        </div>
                        <Accordion defaultActiveKey="0">
                          {playlistsContent?.map((playlist, key) => {
                            return (
                              <Accordion.Item eventKey={key}>
                                <Accordion.Header>{playlist}</Accordion.Header>
                                {totalActivities?.map((activity) => {
                                  if (activity?.subManifest?.includes(playlist)) {
                                    return (
                                      <Accordion.Body
                                        onClick={async () => {
                                          for (var i = 0; i < contents.length; i++) {
                                            const contentRead = await loadzipper.files[
                                              contents[i]
                                            ].async("text");
                                            // contentsDetail.push(contentRead);
                                            if (
                                              contents[i].includes(activity.name) &&
                                              contents[i].includes("-h5p")
                                            ) {
                                              console.log("activitydata", contentRead);
                                              setActivityh5p(JSON.parse(contentRead));
                                            }
                                          }
                                        }}
                                      >
                                        {activity.name}
                                      </Accordion.Body>
                                    );
                                  } else {
                                    <h3>No Activity found</h3>;
                                  }
                                })}
                              </Accordion.Item>
                            );
                          })}
                        </Accordion>
                      </Tab>
                    </Tabs>
                    {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      id="overview-tab"
                      data-toggle="tab"
                      href="#overview"
                      role="tab"
                      aria-controls="overview"
                      aria-selected="true"
                    >
                      Overview
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      id="course-content-tab"
                      data-toggle="tab"
                      href="#course-content"
                      role="tab"
                      aria-controls="course-content"
                      aria-selected="false"
                    >
                      Content
                    </a>
                  </li>
                </ul> */}
                    {/* <div className="loading"></div> */}
                  </div>
                </div>
              </div>
              {/* <div className="col-12">
            <div className="alert-message-box">
              <div className="alert-wrap update">
                <div className="alert-icon" onclick="window.location.reload()">
                  <img src={updateicon} /> Update
                </div>
              </div>
            </div>
          </div> */}
            </div>
          </div>
          <div className="c23-bottom-menu">
            <div className="menu-list">
              <ul>
                <li className="active-list">
                  <a href="#">
                    <img src={homemenuicon} width="24" height="24" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={searchmenuicon} width="24" height="24" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Myc2eOverview;
