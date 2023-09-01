import React, { useEffect, useRef, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';

import Dropdown from 'react-bootstrap/Dropdown';
import searchIcon from '../../assets/images/icons/search1.png';
import addIcon from '../../assets/images/icons/add-icon.svg';
import NavigationIcon from '../../assets/images/icons/navigation-icon.svg';
import DeleteIcon from '../../assets/images/icons/delete-icon.svg';

import JSZip from 'jszip';

import Slider from '../../components/slider';

const HomePreview = ({
  walletConnection,
  setModalShow,
  setActiveC2e,
  setJSlipParser,
}) => {
  const inp = useRef();
  const [loader, setLoader] = useState();
  const [error, setError] = useState();
  const [apiProject, setapiProject] = useState();
  const [query, setQuery] = useState('');
  const user = 'preview-c2e@curriki.org';
  //const apiBaseUrl = 'https://c2e-api.curriki.org/api/v1/c2e/decrypt';
  const apiBaseUrl = 'https://c2e-api.curriki.org/';

  const listProjects = async () => {
    const allProjects = await fetch(
      apiBaseUrl +
        'api/v1/c2e/reader/listc2e?' +
        new URLSearchParams({ user, query })
    );
    const result = await allProjects.json();
    setapiProject(result?.projects);
  };

  const loadPreviewC2E = async () => {

    // Get the current URL
    const url = new URL(window.location.href);

    // Get the value of the 'c2e' parameter
    const c2ePreviewUrl = url.searchParams.get('c2e');

    fetch(c2ePreviewUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Convert the response to a Blob
      return response.blob();
    })
    .then(c2eBlob => {
      var formdata = new FormData();
      formdata.append('user', user);
      formdata.append('c2e', c2eBlob, 'c2e-preview.c2e');
      var requestOptions = {
        method: 'POST',

        body: formdata,
        redirect: 'follow',
      };

      fetch(
        apiBaseUrl+'api/v1/c2e/decrypt',
        requestOptions
      )
        .then(async (response) => {
          console.log(response);
          if (response.status !== 200) {
            response.json().then((e) => setError(e.error)).catch((e) => {
              console.log('Error uploading C2E', e);
              setError('Error processing C2E. Make sure your file matches the latest C2E standard format.');
            });
            setLoader(false);
            return;
          }
          response.arrayBuffer().then(async (data) => {
            setLoader(false);
            const blob = new Blob([data], {
              type: 'application/octet-stream',
            });

            const loadzip = await JSZip.loadAsync(blob);

            loadzip.forEach(async (relativePath, zipEntry) => {
              if (zipEntry.name.includes('.c2e')) {
                const loadzip1 = await JSZip.loadAsync(
                  zipEntry.async('blob')
                );

                setJSlipParser(loadzip1);
              }
            });
          });
        })
        .catch((error) => {
          setError(error);
          setLoader(false);
        });      
    });

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

  const deleteC2E = async (data) => {
    const params = {
      user,
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
    //listProjects();
    loadPreviewC2E();
  }, [query]);

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
              {walletConnection?.name}
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
          <div
            role="button"
            onClick={() => {
              inp?.current?.click();
            }}
            className="add-card"
          >
            <img src={addIcon} alt="add icon" />
            <h5 className="add-text">Add C2E</h5>
            <input
              ref={inp}
              type="file"
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (e.target.files.length === 0) return;
                setLoader(true);
                var formdata = new FormData();
                formdata.append('user', user);
                formdata.append('c2e', e.target.files[0]);
                var requestOptions = {
                  method: 'POST',

                  body: formdata,
                  redirect: 'follow',
                };

                fetch(
                  apiBaseUrl+'api/v1/c2e/decrypt',
                  requestOptions
                )
                  .then(async (response) => {
                    console.log(response);
                    if (response.status !== 200) {
                      response.json().then((e) => setError(e.error)).catch((e) => {
                        console.log('Error uploading C2E', e);
                        setError('Error processing C2E. Make sure your file matches the latest C2E standard format.');
                      });
                      setLoader(false);
                      return;
                    }
                    response.arrayBuffer().then(async (data) => {
                      setLoader(false);
                      const blob = new Blob([data], {
                        type: 'application/octet-stream',
                      });

                      const loadzip = await JSZip.loadAsync(blob);

                      loadzip.forEach(async (relativePath, zipEntry) => {
                        if (zipEntry.name.includes('.c2e')) {
                          const loadzip1 = await JSZip.loadAsync(
                            zipEntry.async('blob')
                          );

                          setJSlipParser(loadzip1);
                        }
                      });
                    });
                  })
                  .catch((error) => {
                    setError(error);
                    setLoader(false);
                  });
              }}
              
              /* 
              onChange={async (e) => {
                const loadzip = await JSZip.loadAsync(e.target.files[0]);
                console.log(loadzip);
                setJSlipParser(loadzip);
                // loadzip.forEach(async (relativePath, zipEntry) => {
                //   const loadzip1 = await JSZip.loadAsync(
                //     zipEntry.async('blob')
                //   );
                //   console.log(loadzip1);

                //   setJSlipParser(loadzip1);
                // });
              }}
               */
            />
          </div>
          {apiProject?.map((data) => {
            return (
              <div
                key={data.id}
                className="add-img-card "
                style={{
                  backgroundImage: `url(${data.thumbnail})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              >
                <div className="add-more-img">
                  <img
                    role="button"
                    src={DeleteIcon}
                    alt="delete"
                    onClick={() => {
                      deleteC2E(data);
                    }}
                  />
                </div>
                <div
                  role="button"
                  onClick={() => {
                    getC2E(data);
                  }}
                  className="card-detail"
                >
                  <h5 className="card-text">
                    {data.c2e_json.c2eMetadata.general.title}
                  </h5>
                  {/* <p className="">13 Jan 2023</p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HomePreview;
