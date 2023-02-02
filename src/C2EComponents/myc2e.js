import React, { useState } from "react";
import JSZip from "jszip";
import search1 from "../assets/images/icons/search1.png";
import menu from "../assets/images/icons/menu1.svg";
import plusicon from "../assets/images/icons/plus-icon.png";
import menuicon from "../assets/images/icons/home-menu-icon.svg";
import searchmenu from "../assets/images/icons/search-menu-icon.svg";
import ellipsisicon from "../assets/images/icons/ellipse-icon.svg";
import { Link } from "react-router-dom";
const Myc2e = () => {
  const [contentData, setcontentData] = useState();
  const [contentDetail, setcontentDetail] = useState(null);
  const [projectJSON, setProjectJSON] = useState(null);
  const [activityh5p, setActivityh5p] = useState(null);
  console.log("projectJSON", projectJSON);
  return (
    <div className="main-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="header-menu">
              <img src={menu} width="24" height="24" />
            </div>
          </div>
          <div className="main-wrap">
            <div className="main-title mb-4">
              <h4>Hello,</h4>
              <h4>Jane Cooper</h4>
            </div>
            <div className="project-search">
              <input name="search" placeholder="Search your c2e..." />
              <button>
                <img src={search1} width="24" height="24" />
              </button>
            </div>
            <div className="my-c2e-heading mb-1">
              <h3>My C2E's</h3>
            </div>
            <div className="c2e-filters">
              <button className="filter-btn active-filter-btn">All</button>
              <button className="filter-btn">Due date</button>
              <button className="filter-btn">Completed</button>
            </div>

            {/* <!-- <div
              className="download-projects-list"
              id="offlineMyc2eContainer"
            ></div> --> */}

            <div className="my-c2e-cards-wrapper" id="offlineMyc2eContainer">
              <div className="add-c2e-card">
                <div className="c2e-card-content" id="add-C2E">
                  <img src={plusicon} width="20" height="20" />
                  <p className="mt-1 add-c2e-text">
                    {/* <a href="addC2E.html">Add C2E</a> */}
                    <input
                      type="file"
                      onChange={async (e) => {
                        console.log("name", e.target.files);
                        const loadzip = await JSZip.loadAsync(e.target.files[0]); // 1) read the Blob
                        console.log(loadzip);
                        const contents = [];
                        const contentsDetail = [];
                        loadzip.forEach((relativePath, zipEntry) => {
                          contents.push(zipEntry.name);
                        });
                        setcontentData(contents);
                        for (var i = 0; i < contents.length; i++) {
                          const contentRead = await loadzip.files[contents[i]].async("text");
                          contentsDetail.push(contentRead);
                          if (contents[i].includes("project.json")) {
                            setProjectJSON(JSON.parse(contentRead));
                          }
                        }
                        setcontentDetail(contentsDetail);
                      }}
                    />
                  </p>
                </div>
              </div>
              {projectJSON && (
                <div className="my-c2e-card">
                  <div className="ellipses-dropdown">
                    <img src={ellipsisicon} width="16px" height="16px" />
                  </div>
                  <div className="c2e-card-content">
                    <Link>
                      <span className="project-heading">{projectJSON?.name}</span>
                    </Link>
                    <span>{projectJSON?.created_at}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-12 remove-course-alert"></div>
        </div>
      </div>
      <div className="c23-bottom-menu">
        <div className="menu-list">
          <ul>
            <li className="active-list">
              <a href="#">
                <img src={menuicon} width="24" height="24" />
              </a>
            </li>
            <li>
              <a href="#">
                <img src={searchmenu} width="24" height="24" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Myc2e;
