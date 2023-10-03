import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";

import defaultImage from "../../assets/images/C2E-Image-15.jpg";
import { useHistory } from "react-router-dom";

const C2eAccordion = ({ bookData, getC2E }) => {
  const [expand, setExpand] = useState(null);

  const history = useHistory();

  const filterBook = new Set(bookData?.map((i) => i?.cee.subjectOf));
  return (
    <Accordion className="book-accordion" defaultActiveKey={0}>
      {Array.from(filterBook)?.map((item, index) => (
        <Accordion.Item eventKey={index}>
          <Accordion.Header key={index}>
            <img src={defaultImage} alt="book" />
            {item}
          </Accordion.Header>
          <Accordion.Body>
            {bookData
              ?.filter((data) => data.cee.subjectOf === item)
              ?.map((data1, index) => {
                return (
                  <div key={index} className="chapter-detail">
                    <h1
                      onClick={() => {
                        getC2E(data1?.cee.id);
                        // history.push("/book");
                      }}
                    >
                      {data1.cee?.title}
                    </h1>
                    <p>
                      {data1.cee?.description?.length > 170
                        ? expand === index
                          ? data1.cee?.description
                          : `${data1.cee?.description.slice(0, 170)}...`
                        : data1.cee?.description}
                      {data1.cee?.description?.length > 170 && (
                        <span>
                          <button
                            className="read-more-btn"
                            onClick={() =>
                              setExpand((prevOpenIndex) =>
                                prevOpenIndex === index ? null : index,
                              )
                            }
                          >
                            {expand === index ? (
                              <span className="expand ">
                                <ExpandIcon />
                              </span>
                            ) : (
                              <ExpandIcon />
                            )}
                          </button>
                        </span>
                      )}
                    </p>
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

const ExpandIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M9.00039 9.91796L11.9254 6.99296C12.0629 6.85546 12.2379 6.78671 12.4504 6.78671C12.6629 6.78671 12.8379 6.85546 12.9754 6.99296C13.1129 7.13046 13.1816 7.30546 13.1816 7.51796C13.1816 7.73046 13.1129 7.90546 12.9754 8.04296L9.52539 11.493C9.45039 11.568 9.36914 11.6212 9.28164 11.6527C9.19414 11.6842 9.10039 11.6997 9.00039 11.6992C8.90039 11.6992 8.80664 11.6835 8.71914 11.652C8.63164 11.6205 8.55039 11.5675 8.47539 11.493L5.02539 8.04296C4.88789 7.90546 4.81914 7.73046 4.81914 7.51796C4.81914 7.30546 4.88789 7.13046 5.02539 6.99296C5.16289 6.85546 5.33789 6.78671 5.55039 6.78671C5.76289 6.78671 5.93789 6.85546 6.07539 6.99296L9.00039 9.91796Z"
        fill="#084892"
      />
      <rect
        x="17.25"
        y="17.25"
        width="16.5"
        height="16.5"
        rx="8.25"
        transform="rotate(180 17.25 17.25)"
        stroke="#084892"
        stroke-width="1.5"
      />
    </svg>
  );
};
