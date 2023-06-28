import React from 'react';

const Index = ({ blueText, yellowText }) => {
  return (
    <div className="main-banner">
      <div className="banner-content">
        <h1>
          {blueText} <span>{yellowText}</span>{' '}
        </h1>
      </div>
    </div>
  );
};

export default Index;
