import React, { useEffect, useState, useRef } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import JSZip from 'jszip';
import { useHistory, useLocation } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';

import './style.css';

const ownStyles = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: '#fff',
    background: '#084892',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: '#fff',
    background: '#084892',
  },
};

const Epub = () => {
  useEffect(() => {});
  const [activeC2E, setActiveC2e] = useState(false);

  const [JSlipParser, setJSlipParser] = useState(null);
  const [allFiles, setAllFIles] = useState(null);
  const [epbFile, setEpbFile] = useState(null);
  const [c2eResource, setC2eResource] = useState(null);

  // And your own state logic to persist state
  const [location, setLocation] = useState(null);
  const renditionRef = useRef(null);
  const tocRef = useRef(null);
  const [loader, setLoader] = useState();
  const [error, setError] = useState(false);
  const [isPreview, setPreview] = useState(false);

  const [timer, setTimer] = useState(90);
  const history = useHistory();

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    if (renditionRef.current && tocRef.current) {
      setLocation(epubcifi);
    }
  };
  // detect id
  const queryString = useLocation();
  useEffect(() => {
    setError(false);
    let id = queryString.search?.split('=')?.[1];
    if (id) {
      getC2E(id);
    }
  }, [queryString.search]);

  const getC2E = async (ceeId) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ceeId: ceeId,
        token: localStorage.getItem('oAuthToken'),
        decrypt: true,
      }),
    };
    window.scrollTo(0, 0);
    setLoader(true);

    const allProjects = await fetch(apiBaseUrl + 'c2e-licenses/buyer', {
      method: 'POST',
      body: JSON.stringify({ token: localStorage.getItem('oAuthToken') }),
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const result = await allProjects.json();
    const isPreview =
      result?.filter((data) => data.cee?.id === ceeId)?.[0]
        ?.creativeWorkStatus === 'preview'
        ? true
        : false;
    setPreview(isPreview);

    fetch(`${apiBaseUrl}c2e/licensed`, options).then((response) => {
      response.arrayBuffer().then(async (data) => {
        setLoader(false);
        const blob = new Blob([data], {
          type: 'application/octet-stream',
        });
        try {
          const loadzip = await JSZip.loadAsync(blob);

          loadzip.forEach(async (relativePath, zipEntry) => {
            if (zipEntry.name.includes('.html')) {
              setJSlipParser(loadzip);
            } else if (zipEntry.name.includes('.c2e')) {
              const loadzip1 = await JSZip.loadAsync(zipEntry.async('blob'));
              setJSlipParser(loadzip1);
            }
          });
        } catch (e) {
          setError(true);
        }
      });
    });
  };

  useEffect(() => {
    if (timer <= 0) return;

    setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  useEffect(() => {
    if (JSlipParser) {
      const contents = [];

      JSlipParser.forEach((relativePath, zipEntry) => {
        contents.push(zipEntry.name);
      });

      setAllFIles(contents);
    }
  }, [JSlipParser]);

  useEffect(() => {
    (async () => {
      if (allFiles) {
        const c2edata = await returnContentFromUrl('c2e.json');
        console.log(c2edata)
        setActiveC2e(c2edata);
        const result = await returnContentFromUrl('content/contents.json');

        if (result) {
          // epub
          // need to check here waqar
          const AllEpub = result?.c2eContents.filter(
            (data) => data.learningResourceType === 'EPUB'
          )?.[0];
          if (AllEpub) {
            const AllEpubData = await returnContentFromUrl(
              AllEpub.url.charAt(0) === '/'
                ? AllEpub?.url.substr(1, AllEpub?.url.length - 1)
                : AllEpub?.url
            );

            const AllEpubData1 = await ExtractFromFile(
              AllEpubData.file.charAt(0) === '/'
                ? AllEpubData?.file.substr(1, AllEpubData?.file.length - 1)
                : AllEpubData?.file
            );

            const resoruces = c2edata?.c2eContainer?.filter(
              (x) => x['@id'] === 'c2ens:c2eResources'
            );
            const resoruce =
              Array.isArray(resoruces) && resoruces.length > 0
                ? resoruces[0]?.c2eResources.find(
                    (r) => r.url === '/' + AllEpubData1.unsafeOriginalName
                  )
                : null;
            setC2eResource(resoruce);
            const epubData = await AllEpubData1.async('uint8array');
            setEpbFile(epubData);
          }
        }
      }
    })();
  }, [allFiles]);

  const returnContentFromUrl = async (url) => {
    for (var i = 0; i < allFiles.length; i++) {
      if (allFiles[i].includes(url)) {
        const contentRead = await JSlipParser.files[allFiles[i]].async('text');

        const data = JSON.parse(contentRead);

        return data;
      }
    }
    return;
  };

  const ExtractFromFile = async (url) => {
    for (var i = 0; i < allFiles.length; i++) {
      if (allFiles[i].includes(url)) {
        const data = await JSlipParser.files[allFiles[i]];

        return data;
      }
    }
    return;
  };

  return (
    <>
      <div className="sub-heading-wrapper">
        <h2 className="card-name">{activeC2E?.c2eMetadata?.general?.title}</h2>
        <button
          onClick={() => {
            setEpbFile(null);
            history.push('/');
          }}
        >
          Back
        </button>
      </div>
      <div style={{ display: 'flex', gap: '20px', padding: '30px' }}>
        {isPreview && timer > 0 && (
          <div className="preview-watermark">PREVIEW</div>
        )}
        {isPreview && timer > 0 && (
          <div className="preview-countdown">{timer} seconds left...</div>
        )}
        {isPreview && timer < 1 && (
          <p>
            Preview time is up. Please purchase a license to experience the full
            content
          </p>
        )}
        {((isPreview && timer > 0) || !isPreview) && (
          <div id="reader-container" style={{ height: '100vh', width: '100%' }}>
            {loader && (
              <div>
                <Alert variant="warning">
                  <Spinner size="md" /> &nbsp; &nbsp; Validating and decrypting
                  the C2E file, please wait ....
                </Alert>
              </div>
            )}
            {error ? (
              <Alert variant="danger">Something Went Wrong!!</Alert>
            ) : (
              <ReactReader
                epubOptions={{
                  allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
                  flow: "scrolled",
                  manager: "continuous",
                }}
                location={location}
                locationChanged={locationChanged}
                tocChanged={(toc) => (tocRef.current = toc)}
                url={epbFile}
                showToc={true}
                readerStyles={ownStyles}
                getRendition={(rendition) => {
                  renditionRef.current = rendition;
                  rendition.hooks.content.register(async function (contents) {
                    const scriptEle = contents.document.createElement('script');
                    scriptEle.type = 'text/javascript';
                    scriptEle.async = true;
                    scriptEle.src = window.location.origin + '/tincan.js';

                    scriptEle.addEventListener('load', (ev) => {
                      const c2eIdSplit = activeC2E['@id'].split(':');
                      const c2eId =
                        Array.isArray(c2eIdSplit) && c2eIdSplit.length > 1
                          ? c2eIdSplit[1]
                          : 'NIL';
                      const licensee =
                        activeC2E?.c2eMetadata?.copyright?.license?.licensee;
                      console.log('c2eResource >>', c2eResource);
                      console.log('activeC2E >>', activeC2E);
                      console.log('c2eId >>', c2eId);
                      console.log('licensee >>', licensee);
                      console.log('licensee.name >>', licensee.name);
                      console.log('licensee.email >>', licensee.email);

                      var tincan = new contents.window.TinCan({
                        recordStores: [
                          {
                            endpoint:
                              'https://c2e-trax.curriki.org/trax/ws/xapi',
                            username: '9491dfe3-fd45-4bb8-b9d5-3480bcddd780',
                            password: '8a290a3a-ff9b-4d5c-a4e9-96550d85b393',
                            allowFail: false,
                          },
                        ],
                      });

                      if ('atStart' in renditionRef.current.location) {
                        var statement = {
                          actor: {
                            mbox: licensee.email,
                            name: licensee.name,
                          },
                          verb: {
                            id: 'http://activitystrea.ms/schema/1.0/consume',
                            display: {
                              'en-US': 'consumed',
                            },
                          },
                          object: {
                            id: 'https://c2e.curriki.org/' + c2eId,
                            definition: {
                              name: {
                                'en-US': activeC2E?.c2eMetadata?.general?.title,
                              },
                              extensions: {},
                            },
                          },
                        };

                        const c2eResourceXapi = {
                          '@id': c2eResource?.['@id'].replace(
                            'c2ens:',
                            'https://c2e.curriki.org/'
                          ),
                          '@type': 'https://schema.org/DigitalDocument',
                          'https://schema.org/identifier': {
                            '@type': 'https://schema.org/PropertyValue',
                            'https://schema.org/propertyID':
                              c2eResource?.identifier.propertyID,
                            'https://schema.org/value':
                              c2eResource?.identifier.value,
                          },
                          'https://schema.org/fileFormat':
                            c2eResource?.fileFormate,
                          'https://schema.org/url': c2eResource?.url,
                        };
                        statement.object.definition.extensions[
                          'https://c2e.curriki.org/xAPI/c2eResource'
                        ] = c2eResourceXapi;

                        if ('subjectOf' in activeC2E?.c2eMetadata) {
                          const c2eSubjectOfXapi = {
                            ...JSON.parse(
                              JSON.stringify(activeC2E?.c2eMetadata?.subjectOf)
                                .replaceAll(
                                  'c2ens:',
                                  'https://c2e.curriki.org/'
                                )
                                .replaceAll('sdons:', 'https://schema.org/')
                            ),
                          };
                          statement.object.definition.extensions[
                            'https://c2e.curriki.org/xAPI/c2eSubjectOf'
                          ] = c2eSubjectOfXapi;
                        }

                        tincan.sendStatement(statement);
                      }
                    });

                    scriptEle.addEventListener('error', (ev) => {
                      console.log({
                        status: false,
                        message: `Failed to load the script ＄{FILE_URL}`,
                      });
                    });
                    contents.document.body.appendChild(scriptEle);
                  });
                }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Epub;
