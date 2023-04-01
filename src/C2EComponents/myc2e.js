import React, { useState, useRef } from 'react';
import c2e from '../assets/images/c2e.png';
import logo from '../assets/images/logo.png';
import upload from '../assets/images/upload (1).svg';
import JSZip from 'jszip';
import Myc2eOverview from './myc2eoverview';

const Myc2e = () => {
  const [contentData, setcontentData] = useState();
  const [contentDetail, setcontentDetail] = useState(null);
  const [projectJSON, setProjectJSON] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [loadzipper, setloadzipper] = useState(null);
  const inp = useRef();
  return (
    <div className="reader-c2e">
      <img src={logo} alt="logo" className="header-logo" />
      {!contentDetail ? (
        <div className="reader-main">
          <div className="img-box">
            <img src={c2e} alt="logo" />
          </div>
          <div className="uploadBox">
            <div className="box">
              <h1>Curriki Educational Experience Reader</h1>
              <div
                className="iconbox"
                onClick={() => {
                  inp.current.click();
                }}
              >
                <img src={upload} alt="logo" />
              </div>
              <p className="text">Loreium ipsum dolet kilil asa</p>
              <button
                onClick={() => {
                  inp.current.click();
                }}
              >
                Choose File
              </button>
              <input
                ref={inp}
                type="file"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  console.log('name', e.target.files);
                  const loadzip = await JSZip.loadAsync(e.target.files[0]); //  read the zip file
                  if (!loadzip.files['c2e.json']) {
                    alert(
                      'please uplaod only C2E Project, c2e.json not found.'
                    );
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
                    const contentRead = await loadzip.files[contents[i]].async(
                      'text'
                    );
                    contentsDetail.push(contentRead);

                    if (
                      contents[i].includes('c2e.json') &&
                      !contents[i].includes('activities')
                    ) {
                      const c2edata = JSON.parse(contentRead);
                      c2edata?.c2eContain?.[0].c2eResources?.map(
                        async (resource) => {
                          // set project json after filter
                          if (resource.url === 'project.json') {
                            const contentProject = await loadzip.files[
                              'project.json'
                            ].async('text');
                            setProjectJSON(JSON.parse(contentProject));
                          }
                          // extract array  of playlist depend on directory present in resoruce folder
                          if (
                            resource.fileFormat === 'directory' &&
                            resource.url !== 'activities' &&
                            resource.url !== 'playlists'
                          ) {
                            setplaylists((prevplaylists) => [
                              ...prevplaylists,
                              resource.url,
                            ]);
                          }
                        }
                      );
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
