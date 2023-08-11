import React, { useState } from 'react';
import { ReactReader } from 'react-reader';

function App() {
  const [epubContentUrl, setEpubContentUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contentBlobUrl = URL.createObjectURL(new Blob([e.target.result]));
        setEpubContentUrl(contentBlobUrl);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {epubContentUrl && <ReactReader url={epubContentUrl} />}
    </div>
  );
}

export default App;