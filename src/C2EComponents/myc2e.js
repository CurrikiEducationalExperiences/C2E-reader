import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { Link } from "react-router-dom";
import Myc2eOverview from "./myc2eoverview";
import H5PEditor from "../H5PComponents/H5PEditors";
import plusicon from "../assets/images/icons/plus-icon.png";
import menuicon from "../assets/images/icons/home-menu-icon.svg";
import searchmenu from "../assets/images/icons/search-menu-icon.svg";
import ellipsisicon from "../assets/images/icons/ellipse-icon.svg";

const Myc2e = () => {
  const [contentData, setcontentData] = useState();
  const [contentDetail, setcontentDetail] = useState(null);
  const [projectJSON, setProjectJSON] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [loadzipper, setloadzipper] = useState(null);
  const inp = useRef();

  return (
    <div className="main-wrapper reader-c2e">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12"></div>
          <div className="main-wrap">
            <div className="main-title mb-4">
              <h4>C2E Reader</h4>
            </div>
            <div className="my-c2e-cards-wrapper" id="offlineMyc2eContainer">
              <div className="add-c2e-card" onClick={() => inp.current.click()}>
                <div className="c2e-card-content" id="add-C2E">
                  <img src={plusicon} width="20" height="20" />
                  <p className="mt-1 add-c2e-text">
                    <input
                      ref={inp}
                      type="file"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        console.log("name", e.target.files);
                        const loadzip = await JSZip.loadAsync(e.target.files[0]); //  read the zip file
                        if (!loadzip.files["c2e.json"]) {
                          alert("please uplaod only C2E Project, c2e.json not found.");
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
                          const contentRead = await loadzip.files[contents[i]].async("text");
                          contentsDetail.push(contentRead);

                          if (
                            contents[i].includes("c2e.json") &&
                            !contents[i].includes("activities")
                          ) {
                            const c2edata = JSON.parse(contentRead);
                            c2edata?.c2eContain?.[0].c2eResources?.map(async (resource) => {
                              // set project json after filter
                              if (resource.url === "project.json") {
                                const contentProject = await loadzip.files["project.json"].async(
                                  "text"
                                );
                                setProjectJSON(JSON.parse(contentProject));
                              }
                              // extract array  of playlist depend on directory present in resoruce folder
                              if (
                                resource.fileFormat === "directory" &&
                                resource.url !== "activities" &&
                                resource.url !== "playlists"
                              ) {
                                setplaylists((prevplaylists) => [...prevplaylists, resource.url]);
                              }
                            });
                          }
                        }
                        setcontentDetail(contentsDetail);
                      }}
                    />
                  </p>
                </div>
              </div>
              {/* show project detail */}
              {projectJSON && (
                <div className="my-c2e-card">
                  <div className="ellipses-dropdown">
                    <img src={ellipsisicon} width="16px" height="16px" />
                  </div>
                  <div className="c2e-card-content">
                    <Link
                      onClick={() => {
                        // setplaylists(projectJSON?.playlists);
                      }}
                    >
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
      {/* playlist content component */}
      <Myc2eOverview
        playlistsContent={playlists}
        setActivityh5p={setActivityh5p}
        contentDetail={contentDetail}
        contents={contentData}
        loadzipper={loadzipper}
      />
      {/* h5p component and send h5p props for content*/}
      <H5PEditor h5p={activityh5p} />
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
