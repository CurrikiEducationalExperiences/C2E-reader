import React, { useState, useEffect } from 'react';

import H5PEditor from '../H5PComponents/H5PEditors';

import 'react-circular-progressbar/dist/styles.css';

import Home from '../pages/Home/home';

import Modal from 'react-bootstrap/Modal';

import Overview from '../pages/Overview/overview';

const Myc2e = ({ walletConnection }) => {

  const [modalShow, setModalShow] = React.useState(false);
  const [modalShow1, setModalShow1] = React.useState(false);
  const [activeC2E, setActiveC2e] = useState(false);
  const [c2e, c2edetail] = useState(null);
  const [projects, setProjects] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [JSlipParser, setJSlipParser] = useState(null);
  const [allFiles, setAllFIles] = useState(null);

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

  useEffect(() => {
    if (projects?.length) {
      setModalShow(true);
    }
  }, [projects]);

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

  return (
    <div className="">
      {!modalShow ? (
        <div className="reader-c2e">
          <Home
            setJSlipParser={setJSlipParser}
            setActiveC2e={setActiveC2e}
            setModalShow={setModalShow}
            walletConnection={walletConnection}
          />
        </div>
      ) : (
        <Overview
          projects={projects}
          playlists={playlists}
          activity={activity}
          activeC2E={activeC2E}
          setModalShow={setModalShow}
          setActivityh5p={setActivityh5p}
        />
      )}
      <MyVerticallyCenteredModal
        show={modalShow1}
        onHide={() => setModalShow1(false)}
        activityh5p={activityh5p}
      />
    </div>
  );
};

function MyVerticallyCenteredModal(props) {
  const { activityh5p } = props;
  console.log(activityh5p);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">C2E Player</Modal.Title>
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

// function MyVerticallyCenteredModal1(props) {
//   const { activityh5p } = props;
//   console.log(activityh5p);
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="validator">
//           <div>
//             <Spinner variant="primary" animation="grow" />
//             <Spinner variant="primary" animation="grow" />
//             <Spinner variant="primary" animation="grow" />
//           </div>
//           We are validing C2E licensing information and description.
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }

export default Myc2e;
