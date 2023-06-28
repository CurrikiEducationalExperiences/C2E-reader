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
            text="C2E ensures that your digital documents are effortlessly accessible anytime, anywhere."
            bgColor=" radial-gradient(
            344.91% 141.42% at 100% 0%,
            #2e68bf 0%,
            #084892 100%
          )"
          />
        </div>
        <div className="">
          <Banner
            text="C2E incorporates robust security measures, safeguarding your digital documents against unauthorized access, piracy, and data breaches."
            bgColor="radial-gradient(
            617.34% 84.7% at 68.37% 50%,
            #2e8bbf 0%,
            #0f6595 100%
          )"
          />
        </div>
        <div className="">
          <Banner
            text="C2E allows content creators like you to embed licensing information directly into the digital documents, preventing unauthorized use"
            bgColor="radial-gradient(687.44% 102.00% at 23.99% 31.98%, #5C2EBF 0%, #350F85 100%)"
          />
        </div>
        <div className="">
          <Banner
            text="C2E ensures that intellectual property rights are respected, and  that the creators, the visionaries, the architects of knowledge are duly recognized and rewarded."
            bgColor="radial-gradient(299.26% 77.20% at 69.97% 70.10%, #31BF2E 0%, #11980F 100%)"
          />
        </div>
        <div className="">
          <Banner
            text="C2E ensures that intellectual property rights are respected, and  that the creators, the visionaries, the architects of knowledge are duly recognized and rewarded."
            bgColor="radial-gradient(638.93% 97.96% at 29.41% 67.92%, #BF2E2E 0%, #891616 100%)"
          />
        </div>
      </Slider>
    </div>
  );
};

export default Index;
