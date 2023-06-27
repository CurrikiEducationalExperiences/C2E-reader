import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import searchIcon from '../../assets/images/icons/search1.png';
import addIcon from '../../assets/images/icons/add-icon.svg';
import bgImg from '../../assets/images/principles-micro.png';
import NavigationIcon from '../../assets/images/icons/navigation-icon.svg';
import DownloadIcon from '../../assets/images/icons/actions-download.svg';

const Home = () => {
  return (
    <div className="main-container">
      <div className="heading">
        <h3>
          <span>Hello,</span>
          <br />
          Jane Coooper
        </h3>
      </div>
      <div className="search-wrapper">
        <input type="text" placeholder="Search your c2e..." />
        <div className="search-icon">
          <img src={searchIcon} alt="search" />
        </div>
      </div>
      <h4 className="sub-heading">My C2E’s</h4>
      <div className="sort-filter">
        <span className="filter-box active">All</span>
        <span className="filter-box">Due date</span>
      </div>
      <div className="c2e-cards">
        <div className="add-card">
          <img src={addIcon} alt="add icon" />
          <h5 className="add-text">Add C2E</h5>
        </div>
        <div
          className="add-img-card "
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="dropdown-icon">
            <div className="custom_dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="" id="dropdown-basic">
                  <img src={NavigationIcon} alt="navigation" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <div className="flex items-center w-full gap-1">
                      <p className="font-normal text-[10px] leading-[20px] text-primarycolor2 m-0">
                        Preview
                      </p>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className="">
                      <p className="font-normal text-[10px] leading-[20px] text-primarycolor2 m-0">
                        Add
                      </p>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          {/* <div className="add-more-img">
            <p className="">Add</p>
            <img src={DownloadIcon} alt="download" />
          </div> */}
          <div className="card-detail">
            <h5 className="card-text">Add C2E</h5>
            <p className="">13 Jan 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
