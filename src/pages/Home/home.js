import React, {useRef} from 'react';
import searchIcon from '../../assets/images/icons/search1.png';
import addIcon from '../../assets/images/icons/add-icon.svg';
import bgImg from '../../assets/images/principles-micro.png';
import NavigationIcon from '../../assets/images/icons/navigation-icon.svg';
import DownloadIcon from '../../assets/images/icons/actions-download.svg';
import { projectdata } from '../../C2EComponents/data';
import JSZip from 'jszip';
const Home = ({ walletConnection, setModalShow, setActiveC2e, setJSlipParser }) => {
  const inp = useRef()
  return (
    <div className="main-container">
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

      <h4 className="sub-heading">My C2E’s</h4>


      {/* <div className="sort-filter">
        <span className="filter-box active">All</span>
        <span className="filter-box">Due date</span>
      </div> */}
      <br />
      <div className="c2e-cards">
        <div onClick={()=>{
          inp?.current?.click()
        }} className="add-card">
          <img src={addIcon} alt="add icon" />
          <h5 className="add-text">Add C2E</h5>
          <input
                ref={inp}
                type="file"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const loadzip = await JSZip.loadAsync(e.target.files[0]);
                  setJSlipParser(loadzip);
                }}
                />
        </div>
        {projectdata?.map((data) => {
          return (
            <div
            onClick={()=>{
              setModalShow(true)
              setActiveC2e(data)
            }}
              className="add-img-card "
              style={{
                backgroundImage: `url(${data?.general?.thumb_url})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className="dropdown-icon">
                <img src={NavigationIcon} alt="navigation" />
              </div>
              {/* <div className="add-more-img">
              <p className="">Add</p>
              <img src={DownloadIcon} alt="download" />
            </div> */}
              <div className="card-detail">
                <h5 className="card-text">{data?.general?.title}</h5>
                {/* <p className="">13 Jan 2023</p> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
