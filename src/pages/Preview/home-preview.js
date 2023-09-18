import React, { useEffect } from 'react';
import JSZip from 'jszip';

const HomePreview = ({
  setJSlipParser,
}) => {
  const user = 'preview-c2e@curriki.org';
  const apiBaseUrl = 'https://c2e-api.curriki.org/';

  const loadPreviewC2E = async () => {

    // Get the current URL
    const url = new URL(window.location.href);

    // Get the value of the 'c2e' parameter
    const c2ePreviewUrl = url.searchParams.get('c2e');

    fetch(c2ePreviewUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Convert the response to a Blob
      return response.blob();
    })
    .then(c2eBlob => {
      var formdata = new FormData();
      formdata.append('user', user);
      formdata.append('c2e', c2eBlob, 'c2e-preview.c2e');
      var requestOptions = {
        method: 'POST',

        body: formdata,
        redirect: 'follow',
      };

      fetch(
        apiBaseUrl+'api/v1/c2e/decrypt',
        requestOptions
      )
        .then(async (response) => {
          console.log(response);
          if (response.status !== 200) {
            response.json().then((e) => console.log(e.error)).catch((e) => {
              console.log('Error uploading C2E', e);
              console.log('Error processing C2E. Make sure your file matches the latest C2E standard format.');
            });
            return;
          }
          response.arrayBuffer().then(async (data) => {
            const blob = new Blob([data], {
              type: 'application/octet-stream',
            });

            const loadzip = await JSZip.loadAsync(blob);

            loadzip.forEach(async (relativePath, zipEntry) => {
              if (zipEntry.name.includes('.c2e')) {
                const loadzip1 = await JSZip.loadAsync(
                  zipEntry.async('blob')
                );

                setJSlipParser(loadzip1);
              }
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });      
    });

  };

  useEffect(() => {
    loadPreviewC2E();
  });

  return (
    <div>
      Loading...
    </div>
  );
};

export default HomePreview;
