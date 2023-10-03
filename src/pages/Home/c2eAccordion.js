import React from "react";
import Accordion from "react-bootstrap/Accordion";

import defaultImage from "../../assets/images/C2E-Image-15.jpg";

const C2eAccordion = ({ bookData }) => {
  const filterBook = new Set(bookData?.map((i) => i?.cee.subjectOf));
  return (
    <Accordion className="book-accordion" defaultActiveKey="0">
      {Array.from(filterBook)?.map((item, index) => (
        <Accordion.Item eventKey={index}>
          <Accordion.Header key={index}>
            <img src={defaultImage} alt="book" />
            {item}
          </Accordion.Header>
          <Accordion.Body>
            {bookData
              ?.filter((data) => data.cee.subjectOf === item)
              ?.map((data1) => {
                return (
                  <div className="chapter-detail">
                    <h1>{data1.cee?.title}</h1>
                    <p>{data1.cee?.description}</p>
                  </div>
                );
              })}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default C2eAccordion;
