import React, { useEffect, useRef, useState, useContext } from 'react';
import { Alert, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import searchIcon from '../../assets/images/icons/search1.png';
import addIcon from '../../assets/images/icons/add-icon.svg';
import DeleteIcon from '../../assets/images/icons/delete-icon.svg';
import defaultImage from '../../assets/images/C2E-Image-15.jpg';
import JSZip from 'jszip';
import Slider from '../../components/slider';
import { UserContext } from '../../App';

const Home = ({ setJSlipParser }) => {
  const user = useContext(UserContext);
  const inp = useRef();
  const [loader, setLoader] = useState();
  const [error, setError] = useState();
  const [apiProject, setapiProject] = useState();
  const [apiProject1, setapiProject1] = useState();
  const [query, setQuery] = useState('');
  const apiBaseUrl = 'https://c2e-provider-api.curriki.org/';

  const listProjects = async () => {
    const allProjects = await fetch(apiBaseUrl + 'c2e-licenses/buyer', {
      method: 'POST',
      body: JSON.stringify({ email: user.email }),
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const result = await allProjects.json();
    console.log(result);
    setapiProject(result);
  };

  const getC2E = (data) => {
    fetch(data.c2e_url_decoded).then((response) => {
      response.arrayBuffer().then(async (data) => {
        setLoader(false);
        const blob = new Blob([data], {
          type: 'application/octet-stream',
        });

        const loadzip = await JSZip.loadAsync(blob);
        loadzip.forEach(async (relativePath, zipEntry) => {
          if (zipEntry.name.includes('.c2e')) {
            const loadzip1 = await JSZip.loadAsync(zipEntry.async('blob'));
            setJSlipParser(loadzip1);
          }
        });
      });
    });
  };

  const getC2EDownload = (licenseKey) => {
    fetch(`${apiBaseUrl}/c2e/licensed`, {
      // Prepend the host
      method: 'POST',
      body: JSON.stringify({ licenseKey: licenseKey }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the binary data
        const url = window.URL.createObjectURL(blob); // Create a temporary <a> element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = licenseKey + '.c2e'; // Change the filename as needed
        a.style.display = 'none';
        document.body.appendChild(a);

        // Trigger the download and cleanup
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('License activation failed.');
      });
  };

  const deleteC2E = async (data) => {
    const params = {
      user: user.email,
      c2eid: data.id,
    };
    fetch(apiBaseUrl + 'api/v1/c2e/reader/deletec2e', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    }).then((r) => {
      if (r.status !== 200) setError('Error deleting, please try again.');

      listProjects();
    });
  };

  useEffect(() => {
    listProjects();
  }, [query]);

  useEffect(() => {
    if (apiProject?.length) {
      apiProject?.sort((a, b) => {
        if (a.cee.subjectOf < b.cee.subjectOf) return -1;
        if (a.cee.subjectOf > b.cee.subjectOf) return 1;
        // If "subjectOf" is the same, sort by "title"
        if (a.cee.title < b.cee.title) return -1;
        if (a.cee.title > b.cee.title) return 1;
        return 0;
      });
       console.log(apiProject)
      // Iterate through the sorted array and group chapters under their respective books
      setapiProject1(apiProject)
    }
  }, [apiProject]);

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Holy guacamole!</strong> Check this info.
    </Tooltip>
  );
  return (
    <>
      <Slider />
      <br />

      <div className="main-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div className="heading">
            <h3>
              <span>Hello,</span>

              <br />
              {user.name}
            </h3>
          </div>
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <div className="search-icon">
              <img src={searchIcon} alt="search" />
            </div>
          </div>
        </div>

        <h4 className="sub-heading">My C2E’s</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {loader && (
          <div>
            <Alert variant="warning">
              <Spinner size="md" /> &nbsp; &nbsp; Validating and decrypting the
              C2E file, please wait ....
            </Alert>
          </div>
        )}
        <br />
        <div className="c2e-cards">
          {apiProject1?.map((data) => {
            return (
              <div className="c2e-main-card">
                <div
                  key={data.id}
                  className="add-img-card "
                  style={{
                    backgroundImage: `url(${defaultImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  {/* <div className="add-more-img">
                  <img
                    role="button"
                    src={DeleteIcon}
                    alt="delete"
                    onClick={() => {
                      deleteC2E(data?.cee);
                    }}
                  />
                </div> */}
                  <div role="button" className="card-detail">
                    {data.cee?.description !== 'No Description' &&
                      data.cee?.description && (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip">
                              {data.cee?.description}
                            </Tooltip>
                          }
                        >
                          <div className="flexer">i</div>
                        </OverlayTrigger>
                      )}
                  </div>
                </div>
                <div className="meta">
                  <h3>{data.cee?.subjectOf}</h3>
                  <p>{data.cee?.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
