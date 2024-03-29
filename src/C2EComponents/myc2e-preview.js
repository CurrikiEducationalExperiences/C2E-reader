import React, { useState, useEffect } from "react";
import HomePreview from "../pages/Preview/home-preview";
import Overview from "../pages/Overview/overview";
import Epub from "../components/slider/previewEpub";
import { useHistory } from "react-router-dom";

const Myc2ePreview = ({ walletConnection }) => {
  console.log("preview init");
  const [modalShow, setModalShow] = React.useState(false);
  const [activeC2E, setActiveC2e] = useState(false);
  const [projects, setProjects] = useState(null);
  const [playlists, setplaylists] = useState([]);
  const [activity, setActivity] = useState([]);
  const [activityh5p, setActivityh5p] = useState(null);
  const [JSlipParser, setJSlipParser] = useState(null);
  const [allFiles, setAllFIles] = useState(null);
  const [epbFile, setEpbFile] = useState(null);
  const [c2eResource, setC2eResource] = useState(null);

  useEffect(() => {
    if (JSlipParser) {
      const contents = [];

      JSlipParser.forEach((relativePath, zipEntry) => {
        console.log(relativePath);
        contents.push(zipEntry.name);
      });

      setAllFIles(contents);
    }
  }, [JSlipParser]);

  useEffect(() => {
    (async () => {
      if (allFiles) {
        const c2edata = await returnContentFromUrl("c2e.json");
        setActiveC2e(c2edata);
        const result = await returnContentFromUrl("content/contents.json");

        if (result) {
          // epub
          // need to check here waqar
          const AllEpub = result?.c2eContents.filter(
            (data) => data.learningResourceType === "EPUB",
          )?.[0];
          if (AllEpub) {
            const AllEpubData = await returnContentFromUrl(
              AllEpub.url.charAt(0) === "/"
                ? AllEpub?.url.substr(1, AllEpub?.url.length - 1)
                : AllEpub?.url,
            );
            console.log(AllEpubData);
            const AllEpubData1 = await ExtractFromFile(
              AllEpubData.file.charAt(0) === "/"
                ? AllEpubData?.file.substr(1, AllEpubData?.file.length - 1)
                : AllEpubData?.file,
            );

            const resoruces = c2edata?.c2eContainer?.filter(
              (x) => x["@id"] === "c2ens:c2eResources",
            );
            const resoruce =
              Array.isArray(resoruces) && resoruces.length > 0
                ? resoruces[0]?.c2eResources.find(
                    (r) => r.url === "/" + AllEpubData1.unsafeOriginalName,
                  )
                : null;
            setC2eResource(resoruce);
            const epubData = await AllEpubData1.async("uint8array");
            setEpbFile(epubData);
          }

          // projects

          const AllProjects = result?.c2eContents.filter(
            (data) => data.learningResourceType === "Project",
          );
          const allProjectData = [];
          for (let i = 0; i < AllProjects?.length; i++) {
            const AllProjectsData = await returnContentFromUrl(
              AllProjects[i]?.url.charAt(0) === "/"
                ? AllProjects[i]?.url.substr(1, AllProjects[i]?.url.length - 1)
                : AllProjects[i]?.url,
            );

            allProjectData.push(AllProjectsData);
          }

          setProjects(allProjectData);

          //playlist
          const AllPlaylist = result?.c2eContents.filter(
            (data) => data.learningResourceType === "Playlist",
          );
          const allPlaylistData = [];
          for (let i = 0; i < AllPlaylist?.length; i++) {
            const playlistData = AllPlaylist[i];
            playlistData.title = playlistData.url
              .split("content/")[1]
              .split(".json")[0]
              .replace(/-([a-z])/g, function (g) {
                return " " + g[1].toUpperCase();
              });

            allPlaylistData.push(playlistData);
          }

          setplaylists(allPlaylistData);

          //activities
          const AllActivities = result?.c2eContents.filter(
            (data) => data.learningResourceType === "Activity",
          );
          const allActivitiesData = [];
          for (let i = 0; i < AllActivities?.length; i++) {
            const activityData = await returnContentFromUrl(
              AllActivities[i]?.url.charAt(0) === "/"
                ? AllActivities[i]?.url.substr(
                    1,
                    AllActivities[i]?.url.length - 1,
                  )
                : AllActivities[i]?.url,
            );

            allActivitiesData.push(activityData);
          }
          setActivity(allActivitiesData);
        }
      }
    })();
  }, [allFiles]);

  useEffect(() => {
    if (projects?.length || epbFile) {
      setModalShow(true);
    }
  }, [projects, epbFile]);

  const returnContentFromUrl = async (url) => {
    for (var i = 0; i < allFiles.length; i++) {
      if (allFiles[i].includes(url)) {
        const contentRead = await JSlipParser.files[allFiles[i]].async("text");

        const data = JSON.parse(contentRead);

        return data;
      }
    }
    return;
  };

  const ExtractFromFile = async (url) => {
    for (var i = 0; i < allFiles.length; i++) {
      if (allFiles[i].includes(url)) {
        const data = await JSlipParser.files[allFiles[i]];
        console.log(data);
        return data;
      }
    }
    return;
  };

  return (
    <div className="">
      {!modalShow ? (
        <div className="">
          <HomePreview
            setJSlipParser={setJSlipParser}
            setActiveC2e={setActiveC2e}
            setModalShow={setModalShow}
            walletConnection={walletConnection}
          />
        </div>
      ) : epbFile ? (
        <Epub
          url={epbFile}
          setModalShow={setModalShow}
          activeC2E={activeC2E}
          setEpbFile={setEpbFile}
          c2eResource={c2eResource}
        />
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

export default Myc2ePreview;
