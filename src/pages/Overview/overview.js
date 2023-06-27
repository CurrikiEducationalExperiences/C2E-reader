import React from 'react';
import { Accordion } from 'react-bootstrap';
import BannerImg from '../../assets/images/s2e-banner.png';
const Overview = () => {
  return (
    <div className="main-container">
      <h2 className="card-name">C2E #1</h2>
      <div className="banner-img">
        <img src={BannerImg} alt="banner" />
      </div>
      <div className="flex-box">
        <button className="filter-box active btn-width">Overview</button>
        <button className="filter-box btn-width">Content</button>
      </div>
      <div className="c2e-details">
        <div>
          <h5>Description</h5>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum
            est suspendisse tempor dui. Fringilla dis tincidunt morbi risus
            interdum urna, odio ac. Sit in venenatis gravida enim vitae, nibh
            blandit molestie. Et, nulla nisl laoreet vel tincidunt enim,
            venenatis. Viverra eget lobortis massa viverra at faucibus mauris
            suspendisse. Elit dis.
          </p>
        </div>
        <div>
          <h5>Marketplace:</h5>
          <p>Bill’s Marketplace</p>
        </div>
        <div>
          <h5>Author:</h5>
          <p>Jenny Wilson</p>
        </div>
      </div>
      <h2 className="playlist-heading">Playlists</h2>
      <div className="playlist-accordion">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Playlist #1</Accordion.Header>
            <Accordion.Body>
              <div className="playlist-informtion-box">
                <div className="plylist-activity">
                  <div className="p-a-img">
                    <img src={BannerImg} alt="" />
                  </div>
                  <p>Activity #1</p>
                </div>
                <div className="plylist-activity">
                  <div className="p-a-img">
                    <img src={BannerImg} alt="" />
                  </div>
                  <p>Activity #1</p>
                </div>

                <div className="plylist-activity">
                  <div className="p-a-img">
                    <img src={BannerImg} alt="" />
                  </div>
                  <p>Activity #1</p>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};

export default Overview;
