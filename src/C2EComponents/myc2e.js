import React, { useState, useEffect } from 'react';
import Home from '../pages/Home/home';
import Overview from '../pages/Overview/overview';

const Myc2e = ({ walletConnection }) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [activeC2E, setActiveC2e] = useState(false);
  const [projects, setProjects] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [JSlipParser, setJSlipParser] = useState(null);
  const [allFiles, setAllFIles] = useState(null);

  useEffect(() => {
    if (JSlipParser) {
      const contents = [];
      console.log(JSlipParser);
      JSlipParser.forEach((relativePath, zipEntry) => {
        contents.push(zipEntry.name);
      });
      console.log(contents);
      setAllFIles(contents);
    }
  }, [JSlipParser]);

  useEffect(() => {
    (async () => {
      if (allFiles) {
        const c2edata = await returnContentFromUrl('c2e.json');
        setActiveC2e(c2edata);
        const result = await returnContentFromUrl('content/contents.json');
        console.log(result);
        if (result) {
          // projects
          const AllProjects = result?.c2eContents.filter(
            (data) => data.learningResourceType === 'Project'
          );
          const allProjectData = [];
          for (let i = 0; i < AllProjects?.length; i++) {
            const AllProjectsData = await returnContentFromUrl(
              AllProjects[i]?.url.charAt(0) === '/'
                ? AllProjects[i]?.url.substr(1, AllProjects[i]?.url.length - 1)
                : AllProjects[i]?.url
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
              AllPlaylist[i]?.url.charAt(0) === '/'
                ? AllPlaylist[i]?.url.substr(1, AllPlaylist[i]?.url.length - 1)
                : AllPlaylist[i]?.url
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
              AllActivities[i]?.url.charAt(0) === '/'
                ? AllActivities[i]?.url.substr(
                    1,
                    AllActivities[i]?.url.length - 1
                  )
                : AllActivities[i]?.url
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
      if (allFiles[i].includes(url)) {
        const contentRead = await JSlipParser.files[allFiles[i]].async('text');

        const data = JSON.parse(contentRead);

        return data;
      }
    }
    return;
  };

  return (
    <div className="">
      {!modalShow ? (
        <div className="">
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
          activityh5p={activityh5p}
        />
      )}
    </div>
  );
};

export default Myc2e;
