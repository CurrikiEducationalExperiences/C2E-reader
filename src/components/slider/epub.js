import React, { useEffect, useState, useRef } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import "./style.css";

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

const Epub = ({ url, setModalShow, activeC2E, setEpbFile, c2eResource }) => {
  // And your own state logic to persist state
  const [location, setLocation] = useState(null);
  const renditionRef = useRef(null);
  const tocRef = useRef(null);
  const [epubLoaded, setEpubLoaded] = useState(false);

  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    if (renditionRef.current && tocRef.current) {
      setLocation(epubcifi);
    }
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
              epubOptions={{
                allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
              }}
              location={location}
              locationChanged={locationChanged}
              tocChanged={toc => (tocRef.current = toc)}
              url={url}
              showToc={true}
              readerStyles={ownStyles}
              getRendition={(rendition) => {
                renditionRef.current = rendition;
                rendition.hooks.content.register(async function (contents) {
                  const scriptEle = contents.document.createElement("script");
                  scriptEle.type = "text/javascript";
                  scriptEle.async = true;
                  scriptEle.src = window.location.origin + '/tincan.js';
      
                  scriptEle.addEventListener("load", (ev) => {
                    
                      const c2eIdSplit = activeC2E['@id'].split(':');
                      const c2eId = Array.isArray(c2eIdSplit) && c2eIdSplit.length > 1 ? c2eIdSplit[1] : 'NIL';
                      const licensee = activeC2E?.c2eMetadata?.copyright?.license?.licensee
                      console.log('c2eResource >>', c2eResource);
                      console.log('activeC2E >>', activeC2E);
                      console.log('c2eId >>', c2eId);
                      console.log('licensee >>', licensee);
                      console.log('licensee.name >>', licensee.name);
                      console.log('licensee.email >>', licensee.email);
                      
                      var tincan = new contents.window.TinCan ({
                        recordStores: [
                              {
                                endpoint: "https://c2e-trax.curriki.org/trax/ws/xapi",
                                username: "9491dfe3-fd45-4bb8-b9d5-3480bcddd780",
                                password: "8a290a3a-ff9b-4d5c-a4e9-96550d85b393",
                                allowFail: false
                              }
                            ]
                          }
                        );
                        
                        if('atStart' in renditionRef.current.location) {
                          var statement = {
                            actor: {
                              mbox: licensee.email,
                              name: licensee.name
                            },
                            verb: {
                              id: "http://activitystrea.ms/schema/1.0/consume",
                              display: {
                                "en-US": "consumed"
                              }
                            },
                            object: {
                              id: "https://c2e.curriki.org/" + c2eId,
                              definition: {
                                name: {
                                  "en-US": activeC2E?.c2eMetadata?.general?.title
                                },
                                extensions: {}
                              }
                            }
                          };

                          const c2eResourceXapi = {
                            "@id": c2eResource['@id'].replace('c2ens:', 'https://c2e.curriki.org/'),
                            "@type": "https://schema.org/DigitalDocument",
                            "https://schema.org/identifier" : {
                              "@type": "https://schema.org/PropertyValue",
                                "https://schema.org/propertyID": "ISBN",
                                "https://schema.org/value":  "ISBN: 978-1-119-86164-5; 978-1-119-86165-2 (ebk); 978-1-119-86168-3 (ebk)"
                              },
                              "https://schema.org/fileFormat": c2eResource.fileFormate,
                              "https://schema.org/url": c2eResource.url
                          };
                          
                          statement.object.definition.extensions["https://c2e.curriki.org/xAPI/c2eResource"] = c2eResourceXapi;
                          tincan.sendStatement(statement);
                        }
                  });

                  scriptEle.addEventListener("error", (ev) => {
                      console.log({
                          status: false,
                          message: `Failed to load the script ＄{FILE_URL}`
                      });
                  });
                  contents.document.body.appendChild(scriptEle);
                });
 
                
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Epub;
