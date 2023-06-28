import React from 'react';

const Index = ({ text, bgColor }) => {
  return (
    <div
      className="main-banner"
      style={{
        background: bgColor,
      }}
    >
      <div className="banner-content">
        <h1>{text}</h1>
      </div>
    </div>
  );
};

export default Index;
