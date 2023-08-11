import React, { useEffect, useState } from 'react';
import { ReactReader } from 'react-reader';
import ep from './epub.epub';
import CheckboxTree from 'react-checkbox-tree';

const Epub = ({ url, setModalShow, activeC2E }) => {
  // And your own state logic to persist state
  const [location, setLocation] = useState(null);
  const [meta, setMeta] = useState();
  const [checked, setChecked] = useState();
  const [expanded, setExpand] = useState();
  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };
  useEffect(() => {
    if (checked) {
      setLocation(checked[0]);
    }
  }, [checked]);

  useEffect(() => {
    console.log(ep);
    console.log(URL.createObjectURL(new Blob([url])));
  }, [url]);

  const transformKeys = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => transformKeys(item));
    } else if (typeof data === 'object') {
      const newData = {};
      for (const key in data) {
        let newKey = key;
        if (key === 'id') {
          newKey = 'value';
        } else if (key === 'subitems') {
          newKey = 'children';
        }
        newData[newKey] = transformKeys(data[key]);
      }
      return newData;
    } else {
      return data;
    }
  };
  return (
    <>
      <div className="sub-heading-wrapper">
        <h2 className="card-name">{activeC2E?.c2eMetadata?.general?.title}</h2>

        <button
          onClick={() => {
            setModalShow(false);
          }}
        >
          Back
        </button>
      </div>
      <div style={{ display: 'flex', gap: '20px', padding: '30px' }}>
        <div style={{ width: '25%' }}>
          {meta && (
            <CheckboxTree
              nodes={meta}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpand(expanded)}
            />
          )}
        </div>
        <div style={{ height: '100vh', width: '75%' }}>
          {ep && (
            <ReactReader
              location={location}
              locationChanged={locationChanged}
              url={ep}
              showToc={false}
              getRendition={(rendition) => {
                setMeta(transformKeys(rendition?.book?.navigation?.toc));
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
