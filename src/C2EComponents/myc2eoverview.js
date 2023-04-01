import React, { useEffect, useState, useRef } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import courselist from '../assets/images/course-list-img.png';
import activityfile from '../assets/images/main-banner-img.png';
import H5PEditor from '../H5PComponents/H5PEditors';

const Myc2eOverview = ({
  playlistsContent,
  setActivityh5p,
  contentDetail,
  contents,
  loadzipper,
  activityh5p,
}) => {
  const [totalActivities, settotalActivities] = useState([]);
  const returnIndex = (filename) => {
    return contents.indexOf(
      contents.filter((data, counter) => data.includes(filename))?.[0]
    );
  };
  const hide = useRef()
  useEffect(() => {
    (async () => {
      // iterate again through each file in zip directory
      for (var i = 0; i < contents.length; i++) {
        const contentRead = await loadzipper.files[contents[i]].async('text');
        // filter total number for activities based on c2e json in activity folder
        if (contents[i].includes('/activities/c2e.json')) {
          const c2edata = JSON.parse(contentRead);
          c2edata?.c2eContain?.[1].c2eComponents?.map(async (resource) => {
            settotalActivities((prevtotalActivities) => [
              ...prevtotalActivities,
              resource,
            ]);
          });
        }
      }
    })();
  }, [playlistsContent]);

  return (
    <div>
      {playlistsContent?.length > 0 && (
        <div className="second-view" >
          <div className="info" ref={hide}>
            <img src={courselist} alt="" id="course-image" />
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum
              est suspendisse tempor dui. Fringilla dis tincidunt morbi risus
              interdum urna, odio ac. Sit in venenatis gravida enim vitae, nibh
              blandit molestie. Et, nulla nisl laoreet vel tincidunt enim,
              venenatis. Viverra eget lobortis massa viverra at faucibus mauris
              suspendisse. Elit dis.
            </p>
            <div className="overview-description">
              <h4>Marketplace:</h4>
              <p>Bill’s Marketplace</p>
            </div>
            <div className="overview-description">
              <h4>Author:</h4>
              <p id="author-name">Jenny Wilson</p>
            </div>
          </div>
          <div className="accordian-c2e">
            <Accordion defaultActiveKey="0">
              {playlistsContent?.map((playlist, key) => {
                return (
                  <Accordion.Item eventKey={String(key)}>
                    <Accordion.Header>{playlist}</Accordion.Header>
                    {totalActivities?.map((activity) => {
                      if (activity?.subManifest?.includes(playlist)) {
                        return (
                          <Accordion.Body
                            onClick={async () => {
                              // on activity click find your respective activity from the total activity
                              for (var i = 0; i < contents.length; i++) {
                                const contentRead = await loadzipper.files[
                                  contents[i]
                                ].async('text');
                                // contentsDetail.push(contentRead);
                                if (
                                  contents[i].includes(activity.name) &&
                                  contents[i].includes('-h5p')
                                ) {
                                  // set h5p data for repsective activity
                                  setActivityh5p(JSON.parse(contentRead));
                                }
                              }
                            }}
                          >
                            <div className="activity-detail" onClick={()=>{
                              hide.current.style.display='none'
                            }}>
                              <img src={activityfile} alt="" />
                              {activity.name}
                            </div>
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
          </div>
          {activityh5p &&
          <div style={{flex:15}}>
          <H5PEditor h5p={activityh5p} />
          </div>
}
        </div>
      )}
    </div>
  );
};

export default Myc2eOverview;
