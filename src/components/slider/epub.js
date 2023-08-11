import React, { useEffect, useState } from "react";
import { ReactReader } from "react-reader";
import CheckboxTree from "react-checkbox-tree";
import "./style.css";

import UnCheckIcon from "../../assets/images/UnCheckbox.svg";
import CheckIcon from "../../assets/images/Checkbox.svg";
import TreeView from "react-jstree-table";

const Epub = ({ url, setModalShow, activeC2E, setEpbFile }) => {
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

  const transformKeys = (data) => {
    if (Array.isArray(data)) {
      return data.map((item) => transformKeys(item));
    } else if (typeof data === "object") {
      const newData = {};
      for (const key in data) {
        let newKey = key;
        if (key === "id") {
          newKey = "value";
        } else if (key === "subitems") {
          newKey = "children";
        }
        newData[newKey] = transformKeys(data[key]);
      }
      return newData;
    } else {
      return data;
    }
  };

  const jstreeConfig = function(data) {
    return {
      core: {
        data: data,
        themes: {
          icons: false,
        },
      }
    };
  }

  const makeTOCDataRecursive = function(toc) {
    var toc_data = [];
    toc.forEach(function (chapter) {
      var children = [];
      if (chapter.subitems.length > 0) {
        children = makeTOCDataRecursive(chapter.subitems);
      }
      toc_data.push({ text: chapter.label, href: chapter.href, children: children });
    });
    return toc_data;
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
        <div style={{ width: "25%" }}>
          {meta && (
            /* 
            <CheckboxTree
              nodes={meta}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpand(expanded)}
              iconsClass="fa5"
              icons={{
                check: <img src={CheckIcon} alt="" />,
                uncheck: <img src={UnCheckIcon} alt="" />,
                halfCheck: <span className="rct-icon rct-icon-half-check" />,
                expandClose: (
                  <span className="rct-icon rct-icon-expand-close" />
                ),
                expandOpen: <span className="rct-icon rct-icon-expand-open" />,
                expandAll: <span className="rct-icon rct-icon-expand-all" />,
                collapseAll: (
                  <span className="rct-icon rct-icon-collapse-all" />
                ),
                parentClose: (
                  <span className="rct-icon rct-icon-parent-close" />
                ),
                parentOpen: <span className="rct-icon rct-icon-parent-open" />,
                leaf: <span className="rct-icon rct-icon-leaf" />,
              }}
            />
            */
            <TreeView treeData={meta} />
          )}
        </div>
        <div style={{ height: "100vh", width: "75%" }}>
          {(
            <ReactReader
              location={location}
              locationChanged={locationChanged}
              url={url}
              showToc={false}
              getRendition={(rendition) => {
                setMeta(jstreeConfig(makeTOCDataRecursive (rendition?.book?.navigation?.toc)));
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
