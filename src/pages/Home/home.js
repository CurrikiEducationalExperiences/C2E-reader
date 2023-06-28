import React, { useEffect, useRef, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';

import Dropdown from 'react-bootstrap/Dropdown';
import searchIcon from '../../assets/images/icons/search1.png';
import addIcon from '../../assets/images/icons/add-icon.svg';
import NavigationIcon from '../../assets/images/icons/navigation-icon.svg';
import DeleteIcon from '../../assets/images/icons/delete-icon.svg';

import JSZip from 'jszip';

import Slider from '../../components/slider';

const Home = ({
  walletConnection,
  setModalShow,
  setActiveC2e,
  setJSlipParser,
}) => {
  const inp = useRef();
  const [loader, setLoader] = useState();
  const [error, setError] = useState();
  const [apiProject, setapiProject] = useState();

  useEffect(() => {
    (async () => {
      const allProjects = await fetch(
        'https://c2e-api.curriki.org/api/v1/c2e/products?userId=1&query='
      );
      const result = await allProjects.json();
      setapiProject(result?.projects);
    })();
  }, []);

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
            <input type="text" placeholder="Search your c2e..." />
            <div className="search-icon">
              <img src={searchIcon} alt="search" />
            </div>
          </div>
        </div>

        <h4 className="sub-heading">My C2E’s</h4>
        {loader && (
          <div>
            <Alert variant="warning">
              <Spinner size="md" /> &nbsp; &nbsp; Validating and decrypting the
              C2E file, please wait ....
            </Alert>
          </div>
        )}
        {/* {error && !loader && (
           <div>
           <Alert variant="error">
            {error}
           </Alert>
         </div>
        )} */}
        {/* <div className="sort-filter">
        <span className="filter-box active">All</span>
        <span className="filter-box">Due date</span>
      </div> */}
        <br />
        <div className="c2e-cards">
          <div
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
                setLoader(true);
                var formdata = new FormData();
                formdata.append('user', 'bob@curriki.org');
                formdata.append('c2e', e.target.files[0]);
                var requestOptions = {
                  method: 'POST',

                  body: formdata,
                  redirect: 'follow',
                };

                fetch(
                  'https://c2e-api.curriki.org/api/v1/c2e/decrypt',
                  requestOptions
                )
                  .then((response) => response.arrayBuffer())
                  .then(async (data) => {
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
                  })
                  .catch((error) => {
                    setError(error);
                    setLoader(false);
                  });
              }}
            />
          </div>

          {apiProject
            ?.filter((data) => data?.general?.visible === 1)
            ?.map((data) => {
              return (
                <div
                  className="add-img-card "
                  style={{
                    backgroundImage: `url(${data?.general?.thumb_url})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                >
                  {/* <div className="dropdown-icon">
                    <div className="custom_dropdown">
                      <Dropdown>
                        <Dropdown.Toggle variant="" id="dropdown-basic">
                          <img src={NavigationIcon} alt="navigation" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <div className="item-about">
                              <p className="">Preview</p>
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <div className="item-about">
                              <p className="">Add</p>
                            </div>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div> 
                  </div> */}
                  <div className="add-more-img">
                    <img src={DeleteIcon} alt="download" />
                  </div>
                  <div
                    onClick={() => {
                      setModalShow(true);
                      setActiveC2e(data);
                    }}
                    className="card-detail"
                  >
                    <h5 className="card-text">{data?.general?.title}</h5>
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

export default Home;
