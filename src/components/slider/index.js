import React from 'react';
import Slider from 'react-slick';
import Banner from './banner';

const Index = () => {
  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 3500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <Slider {...settings}>
        <div className="">
          <Banner
            blueText="C2E ensures that your digital documents are effortlessly accessible anytime, "
            yellowText="anywhere."
          />
        </div>
        <div className="">
          <Banner
            blueText="C2E incorporates robust security measures, safeguarding your digital documents against unauthorized access,"
            yellowText=" piracy, and data breaches."
          />
        </div>
        <div className="">
          <Banner
            blueText="C2E allows content creators like you to embed licensing information directly into the digital documents, "
            yellowText="preventing unauthorized use"
          />
        </div>
        <div className="">
          <Banner
            blueText="C2E ensures that intellectual property rights are respected, and  that the creators, the visionaries, "
            yellowText="the architects of knowledge are duly recognized and rewarded."
          />
        </div>
      </Slider>
    </div>
  );
};

export default Index;
