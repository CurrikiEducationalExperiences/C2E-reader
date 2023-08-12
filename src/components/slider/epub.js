import React, { useEffect, useState } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import CheckboxTree from "react-checkbox-tree";
import "./style.css";

import UnCheckIcon from "../../assets/images/UnCheckbox.svg";
import CheckIcon from "../../assets/images/Checkbox.svg";
import TreeView from "react-jstree-table";

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: '#fff',
    background: '#084892'
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: '#fff',
    background: '#084892'
  },
}

const Epub = ({ url, setModalShow, activeC2E, setEpbFile }) => {
  // And your own state logic to persist state
  const [location, setLocation] = useState(null);

  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };
  
  return (
    <>
      <div className="sub-heading-wrapper">
        <h2 className="card-name">{activeC2E?.c2eMetadata?.general?.title}</h2>
        <button
          onClick={() => {
            setModalShow(false);
            setEpbFile(null);
          }}
        >
          Back
        </button>
      </div>
      <div style={{ display: "flex", gap: "20px", padding: "30px" }}>
        <div id="reader-container" style={{ height: "100vh", width: "100%" }}>
          {(
            <ReactReader
              location={location}
              locationChanged={locationChanged}
              url={url}
              showToc={true}
              readerStyles={ownStyles}
              getRendition={(rendition) => {
                
                // setMeta(rendition);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Epub;
